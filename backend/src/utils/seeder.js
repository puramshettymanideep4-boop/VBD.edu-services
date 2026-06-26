require('dotenv').config();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const School = require('../models/School');
const Product = require('../models/Product');
const CMS = require('../models/CMS');
const Notification = require('../models/Notification');
const Order = require('../models/Order');

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await School.deleteMany();
    await CMS.deleteMany();
    await Notification.deleteMany();

    const createdSchools = await School.insertMany([
      { name: 'Kakatiya School', code: 'KAKATIYA123', logo: 'school', status: 'active', announcement: 'Final exams registration is open. Uniform collection is scheduled for July 1st.' },
      { name: 'ABC School', code: 'ABC456', logo: 'award', status: 'active', announcement: 'New academic year starts on August 15th. Order your stationery packs early!' },
      { name: 'Sunshine School', code: 'SUNSHINE789', logo: 'sun', status: 'active' },
      { name: 'Future School', code: 'FUTURE101', logo: 'rocket', status: 'active' },
    ]);

    // Super Admin — password hashed by pre-save hook
    await User.create({
      name: 'VBD Director',
      email: 'superadmin@vbd.com',
      password: 'password',
      role: 'VBT_SUPER_ADMIN',
    });

    // School Admins — pre-hash since we're using insertMany (no pre-save hook)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('password', salt);

    await User.insertMany([
      { name: 'Kakatiya Admin', email: 'admin@kakatiya.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: createdSchools[0]._id },
      { name: 'ABC Admin',      email: 'admin@abc.edu',      password: hashed, role: 'SCHOOL_ADMIN', schoolId: createdSchools[1]._id },
      { name: 'Sunshine Admin', email: 'admin@sunshine.edu', password: hashed, role: 'SCHOOL_ADMIN', schoolId: createdSchools[2]._id },
      { name: 'Future Admin',   email: 'admin@future.edu',   password: hashed, role: 'SCHOOL_ADMIN', schoolId: createdSchools[3]._id },
    ]);

    await Product.insertMany([
      { schoolId: createdSchools[0]._id, name: 'Math Textbook Vol 1',   category: 'Books',            price: 25,  stock: 100, description: 'CBSE approved Math textbook for Class 10.' },
      { schoolId: createdSchools[0]._id, name: 'Science Experiment Kit', category: 'Educational Kits', price: 45,  stock: 50,  description: 'Complete physics & chemistry experiment kit.' },
      { schoolId: createdSchools[0]._id, name: 'Ergonomic School Bag',   category: 'School Bags',      price: 30,  stock: 200, description: 'Spine-friendly orthopedic carrier.' },
      { schoolId: createdSchools[0]._id, name: 'Geometry Set Deluxe',    category: 'Stationery',       price: 8,   stock: 300, description: 'Precision instruments, compass & ruler set.' },
      { schoolId: createdSchools[1]._id, name: 'ABC School Uniform Tie', category: 'Uniforms',         price: 15,  stock: 150, description: 'Official ABC School uniform tie.' },
      { schoolId: createdSchools[1]._id, name: 'ABC English Workbook',   category: 'Books',            price: 28,  stock: 80,  description: 'English language workbook for Grade 8.' },
      { schoolId: createdSchools[1]._id, name: 'ABC Notebook Bundle',    category: 'Stationery',       price: 12,  stock: 250, description: 'Pack of 10 ruled + 2 graph notebooks.' },
      { schoolId: createdSchools[2]._id, name: 'Sunshine Uniform Set',   category: 'Uniforms',         price: 55,  stock: 120, description: 'Full uniform — shirt, trousers, tie.' },
      { schoolId: createdSchools[2]._id, name: 'Atlas & Maps Bundle',    category: 'Learning Materials',price: 18,  stock: 90,  description: 'Political & physical world atlas set.' },
      { schoolId: createdSchools[3]._id, name: 'STEM Robotics Kit',      category: 'Educational Kits', price: 120, stock: 30,  description: 'Build & program your own robot car.' },
      { schoolId: createdSchools[3]._id, name: 'Electronics Starter Kit',category: 'Educational Kits', price: 65,  stock: 45,  description: 'Breadboard, LEDs, resistors & more.' },
    ]);

    await CMS.create({
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
        { id: 't1', name: 'Dr. Sarah Jenkins',  role: 'Principal',           schoolName: 'Kakatiya School', content: 'VBD transformed our uniform supply chain completely. Zero parent complaints since onboarding.' },
        { id: 't2', name: 'Mr. Arjun Reddy',    role: 'School Administrator', schoolName: 'DPS Global',      content: 'The portal is lightning fast and the products are exactly school-grade quality.' },
        { id: 't3', name: 'Mrs. Priya Sharma',  role: 'Parent',              schoolName: 'Sunrise Academy',  content: 'Ordering my child\'s books took 2 minutes. Delivery was on time. Absolutely seamless.' },
      ],
      faqs: [
        { id: 'f1', question: 'How do I access my school portal?', answer: 'Select your school from the homepage Partner Portals section and log in with your registered email address and school code provided by your institution.' },
        { id: 'f2', question: 'What payment methods are accepted?', answer: 'We support UPI, credit/debit cards, net banking, and cash on delivery for all orders placed through the portal.' },
        { id: 'f3', question: 'Can I return or exchange a product?', answer: 'Yes, returns and exchanges are accepted within 7 days of delivery for unused, sealed items in their original packaging. Contact our support team to initiate a return.' },
        { id: 'f4', question: 'How long does delivery take?', answer: 'Standard delivery takes 3–5 business days. Express delivery is available in select cities. You will receive a tracking number once your order is dispatched.' },
      ],
    });

    await Notification.create({
      title: 'Welcome to VBD Backend',
      message: 'The backend infrastructure has been seeded and deployed successfully.',
      type: 'system',
    });

    console.log('✅ Seed data imported successfully!');
    console.log('');
    console.log('── Admin Credentials ──────────────────────────');
    console.log('  Super Admin : superadmin@vbd.com / password');
    console.log('  Kakatiya    : admin@kakatiya.edu / password  (Code: KAKATIYA123)');
    console.log('  DPS         : admin@dps.edu / password       (Code: DPSGLOBAL)');
    console.log('  Sunrise     : admin@sunrise.edu / password   (Code: SUNRISE99)');
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
  const connectDB = require('../config/db');
  connectDB().then(() => {
    importData().then(() => process.exit()).catch(() => process.exit(1));
  });
} else {
  module.exports = importData;
}
