const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Initializes and updates designated Admin credentials in MongoDB Atlas on deployment startup.
 * Uses process.env.ADMIN_EMAIL and process.env.ADMIN_PASSWORD.
 */
const initAdminCredentials = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@coursedivine.com';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || typeof adminPassword !== 'string' || adminPassword.trim().length < 6) {
      return;
    }

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = adminPassword.trim();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    // Find if target admin account already exists
    let adminUser = await User.findOne({ email: cleanEmail });

    if (adminUser) {
      await User.findByIdAndUpdate(adminUser._id, {
        $set: {
          password: hashedPassword,
          role: 'admin',
          isVerified: true
        }
      });
      console.log(`✅ Admin Credential Sync: Active password updated for ${cleanEmail} in MongoDB Atlas.`);
    } else {
      // Find if there is an existing admin role to update, otherwise create new
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        await User.findByIdAndUpdate(existingAdmin._id, {
          $set: {
            email: cleanEmail,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
          }
        });
        console.log(`✅ Admin Credential Sync: Migrated admin email to ${cleanEmail} with updated password in MongoDB Atlas.`);
      } else {
        await User.create({
          name: 'Course Divine Administrator',
          email: cleanEmail,
          password: hashedPassword,
          role: 'admin',
          isVerified: true
        });
        console.log(`✅ Admin Credential Sync: Created designated Admin account for ${cleanEmail} in MongoDB Atlas.`);
      }
    }
  } catch (error) {
    console.error('❌ Admin Credential Sync Error:', error.message);
  }
};

module.exports = initAdminCredentials;
