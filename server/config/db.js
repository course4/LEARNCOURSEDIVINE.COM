const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 first to prevent Render IPv6 DNS lookup timeouts on MongoDB Atlas
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

// Set reliable public DNS on Windows to prevent querySrv ECONNREFUSED on MongoDB Atlas
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {}
}

const ATLAS_URI = 'mongodb+srv://info_db_user:8iTiFByhIMWvkPfx@cluster0.2be4pxm.mongodb.net/coursedivine?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const options = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    family: 4
  };

  // Try primary URI if specified and different from ATLAS_URI
  if (primaryUri && primaryUri !== ATLAS_URI) {
    try {
      console.log('🔄 Connecting to primary MONGODB_URI...');
      const conn = await mongoose.connect(primaryUri, options);
      console.log(`✅ MongoDB Atlas Connected (Primary): ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.warn(`⚠️ Primary MONGODB_URI connection failed (${error.message}). Trying fallback ATLAS_URI...`);
    }
  }

  // Fallback to verified ATLAS_URI
  try {
    console.log('🔄 Connecting to fallback ATLAS_URI...');
    const conn = await mongoose.connect(ATLAS_URI, options);
    console.log(`✅ MongoDB Atlas Connected (Fallback): ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ All MongoDB connection attempts failed: ${error.message}`);
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
