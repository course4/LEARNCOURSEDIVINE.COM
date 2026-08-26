require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('Connected to MongoDB Atlas');

    // 1. Promote all existing registered users to admin so the owner has full admin privileges!
    await User.updateMany({}, { role: 'admin' });
    console.log('Promoted all existing users to admin.');

    // 2. Ensure master admin accounts exist
    const admin1 = await User.findOne({ email: 'admin@learncoursedivine.com' });
    if (!admin1) {
      await User.create({
        name: 'Course Divine Administrator',
        email: 'admin@learncoursedivine.com',
        password: 'Admin@123',
        role: 'admin',
        referralCode: 'CDADMIN',
        avatar: ''
      });
      console.log('Created admin@learncoursedivine.com');
    }

    const admin2 = await User.findOne({ email: 'admin@coursedivine.com' });
    if (!admin2) {
      await User.create({
        name: 'Course Divine Administrator',
        email: 'admin@coursedivine.com',
        password: 'Admin@123',
        role: 'admin',
        referralCode: 'CDMASTER',
        avatar: ''
      });
      console.log('Created admin@coursedivine.com');
    }

    const allUsers = await User.find({});
    console.log('Total users in DB:', allUsers.map(u => ({ email: u.email, role: u.role })));
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
