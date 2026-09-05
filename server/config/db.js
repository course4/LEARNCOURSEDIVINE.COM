const mongoose = require('mongoose');
const dns = require('dns');

// Set reliable public DNS on Windows to prevent querySrv ECONNREFUSED on MongoDB Atlas
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {}
}

const ATLAS_URI = 'mongodb+srv://info_db_user:8iTiFByhIMWvkPfx@cluster0.2be4pxm.mongodb.net/coursedivine';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || ATLAS_URI;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000
    });
    console.log(`✅ MongoDB Atlas Connected & Fully Active: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

// Automatic Reconnection Event Listeners for 100% High Availability
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Atlas Disconnected. Attempting automatic re-connection...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Atlas Connection Error:', err.message);
});

module.exports = connectDB;
