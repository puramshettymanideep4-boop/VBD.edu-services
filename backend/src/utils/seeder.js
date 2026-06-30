require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const importData = async () => {
  try {
    // Clean up all tables
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
    await prisma.cMS.deleteMany();

    // Insert Schools
    const kakatiya = await prisma.school.create({ data: { name: 'Kakatiya School', code: 'KAKATIYA123', logo: 'school', status: 'ACTIVE', announcement: 'Final exams registration is open. Uniform collection is scheduled for July 1st.' } });
    const abc = await prisma.school.create({ data: { name: 'ABC School', code: 'ABC456', logo: 'award', status: 'ACTIVE', announcement: 'New academic year starts on August 15th. Order your stationery packs early!' } });
    const sunshine = await prisma.school.create({ data: { name: 'Sunshine School', code: 'SUNSHINE789', logo: 'sun', status: 'ACTIVE' } });
    const future = await prisma.school.create({ data: { name: 'Future School', code: 'FUTURE101', logo: 'rocket', status: 'ACTIVE' } });
    const dps = await prisma.school.create({ data: { name: 'DPS Global', code: 'DPSGLOBAL', logo: 'globe', status: 'ACTIVE' } });
    const rockets = await prisma.school.create({ data: { name: 'Rockets Academy', code: 'ROCKET21', logo: 'rocket', status: 'ACTIVE' } });

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('password', salt);

    // Insert Users
    await prisma.user.createMany({
      data: [
        { name: 'VBD Director', email: 'superadmin@vbd.com', password: hashed, role: 'VBT_SUPER_ADMIN' },
        { name: 'Kakatiya Admin', email: 'admin@kakatiya.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: kakatiya.id },
        { name: 'ABC Admin', email: 'admin@abc.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: abc.id },
        { name: 'Sunshine Admin', email: 'admin@sunshine.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: sunshine.id },
        { name: 'Future Admin', email: 'admin@future.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: future.id },
        { name: 'DPS Admin', email: 'admin@dps.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: dps.id },
        { name: 'Rockets Admin', email: 'admin@rockets.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: rockets.id },
      ]
    });

    // Insert Products
    await prisma.product.createMany({
      data: [
        { schoolId: kakatiya.id, name: 'Math Textbook Vol 1', category: 'Books', price: 25, stock: 100, description: 'CBSE approved Math textbook for Class 10.', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80' },
        { schoolId: kakatiya.id, name: 'Science Experiment Kit', category: 'Educational_Kits', price: 45, stock: 50, description: 'Complete physics & chemistry experiment kit.', image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80' },
        { schoolId: kakatiya.id, name: 'Ergonomic School Bag', category: 'School_Bags', price: 30, stock: 200, description: 'Spine-friendly orthopedic carrier.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
        { schoolId: kakatiya.id, name: 'Geometry Set Deluxe', category: 'Stationery', price: 8, stock: 300, description: 'Precision instruments, compass & ruler set.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80' },
        { schoolId: abc.id, name: 'ABC School Uniform Tie', category: 'Uniforms', price: 15, stock: 150, description: 'Official ABC School uniform tie.', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80' },
        { schoolId: abc.id, name: 'ABC English Workbook', category: 'Books', price: 28, stock: 80, description: 'English language workbook for Grade 8.', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80' },
        { schoolId: abc.id, name: 'ABC Notebook Bundle', category: 'Stationery', price: 12, stock: 250, description: 'Pack of 10 ruled + 2 graph notebooks.', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80' },
        { schoolId: sunshine.id, name: 'Sunshine Uniform Set', category: 'Uniforms', price: 55, stock: 120, description: 'Full uniform — shirt, trousers, tie.', image: 'https://images.unsplash.com/photo-1622473590743-f38b4bce07be?auto=format&fit=crop&w=600&q=80' },
        { schoolId: sunshine.id, name: 'Atlas & Maps Bundle', category: 'Learning_Materials', price: 18, stock: 90, description: 'Political & physical world atlas set.', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80' },
        { schoolId: future.id, name: 'STEM Robotics Kit', category: 'Educational_Kits', price: 120, stock: 30, description: 'Build & program your own robot car.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },
        { schoolId: future.id, name: 'Electronics Starter Kit', category: 'Educational_Kits', price: 65, stock: 45, description: 'Breadboard, LEDs, resistors & more.', image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=600&q=80' },
      ]
    });

    // Insert CMS
    await prisma.cMS.create({
      data: {
        homepageTitle: 'VBD Education Services',
        homepageDescription: 'Premium Multi-School E-Commerce Portal',
        aboutContent: 'We provide unified supply chain management for premier schools.',
        heroTitle: 'Elevating Education Supply Chains',
        heroSubtitle: 'VBD Education Services is the premier unified logistics partner for premium educational assets, bridging schools and parents with world-class support.',
        missionText: 'Our mission is to eliminate operational overhead for schools and supply parents with high-quality, authenticated, school-verified assets through a frictionless digital experience.',
        visionText: "To build the world's most dependable and highly secure digitized educational logistics network, powering millions of learning journeys worldwide.",
        statsSchools: 10,
        statsStudents: 10000,
        statsProducts: 1200,
        statsOrders: 30000,
        testimonials: [
          { id: 't1', name: 'Dr. Sarah Jenkins', role: 'Principal', schoolName: 'Kakatiya School', content: 'VBD transformed our uniform supply chain completely. Zero parent complaints since onboarding.' },
          { id: 't2', name: 'Mr. Arjun Reddy', role: 'School Administrator', schoolName: 'DPS Global', content: 'The portal is lightning fast and the products are exactly school-grade quality.' },
          { id: 't3', name: 'Mrs. Priya Sharma', role: 'Parent', schoolName: 'Sunrise Academy', content: 'Ordering my child\'s books took 2 minutes. Delivery was on time. Absolutely seamless.' },
        ],
        faqs: [
          { id: 'f1', question: 'How do I access my school portal?', answer: 'Select your school from the homepage Partner Portals section and log in with your registered email address and school code provided by your institution.' },
          { id: 'f2', question: 'What payment methods are accepted?', answer: 'We support UPI, credit/debit cards, net banking, and cash on delivery for all orders placed through the portal.' },
          { id: 'f3', question: 'Can I return or exchange a product?', answer: 'Yes, returns and exchanges are accepted within 7 days of delivery for unused, sealed items in their original packaging. Contact our support team to initiate a return.' },
          { id: 'f4', question: 'How long does delivery take?', answer: 'Standard delivery takes 3–5 business days. Express delivery is available in select cities. You will receive a tracking number once your order is dispatched.' },
        ],
      }
    });

    await prisma.notification.create({
      data: {
        title: 'Welcome to VBD Backend',
        message: 'The backend infrastructure has been seeded and deployed successfully with PostgreSQL and Prisma.',
        type: 'SYSTEM',
      }
    });

    console.log('✅ Seed data imported successfully!');
    console.log('');
    console.log('── Admin Credentials ──────────────────────────');
    console.log('  Super Admin : superadmin@vbd.com / password');
    console.log('  Kakatiya    : admin@kakatiya.edu / password  (Code: KAKATIYA123)');
    console.log('  DPS         : admin@dps.edu / password       (Code: DPSGLOBAL)');
    console.log('  Sunrise     : admin@sunrise.edu / password   (Code: SUNSHINE99) (Note: Code was SUNSHINE789)');
    console.log('  Rockets     : admin@rockets.edu / password   (Code: ROCKET21)');
    console.log('───────────────────────────────────────────────');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
};

// Allow running as a standalone script
const isDirectRun = require.main === module;
if (isDirectRun) {
  importData().then(() => process.exit()).catch(() => process.exit(1));
} else {
  module.exports = importData;
}
