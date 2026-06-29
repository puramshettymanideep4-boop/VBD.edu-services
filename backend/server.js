require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/prisma');

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log(`✅ PostgreSQL Connected via Prisma`);
  } catch (err) {
    console.error(`❌ Database Connection Error: ${err.message}`);
    process.exit(1);
  }

  // ── Auto-seed if database is empty ──
  try {
    const count = await prisma.user.count();
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
