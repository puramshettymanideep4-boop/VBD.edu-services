require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const startServer = async () => {
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vbd';

  const isLocalMongo = mongoUri.startsWith('mongodb://127.0.0.1') || mongoUri.startsWith('mongodb://localhost');

  if (isLocalMongo) {
    try {
      // Try local MongoDB first (fast 3s timeout)
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to local MongoDB');
    } catch {
      // Fall back to embedded MongoDB (auto-downloads ~60MB binary on first run)
      console.log('⚠️  Local MongoDB unreachable — starting embedded MongoDB...');
      console.log('   (First run downloads ~60MB binary. Please wait...)');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        await mongoose.connect(mongoUri);
        console.log(`✅ Embedded MongoDB started`);
        process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
        process.on('SIGTERM', async () => { await mongod.stop(); process.exit(0); });
      } catch (embedErr) {
        console.error('❌ Embedded MongoDB failed:', embedErr.message);
        process.exit(1);
      }
    }
  } else {
    // Atlas or custom URI
    try {
      await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      process.exit(1);
    }
  }

  // ── Auto-seed if database is empty ──
  try {
    const User = require('./src/models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('📦 Database empty — running auto-seeder...');
      const importData = require('./src/utils/seeder');
      await importData();
    } else {
      console.log(`📋 Database has ${count} user(s) — skipping seed.`);
    }
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }

  // ── Start HTTP server ──
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   API Base: http://localhost:${PORT}/api`);
  });
};

startServer();
