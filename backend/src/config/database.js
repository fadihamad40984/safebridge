const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/safebridge'
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Check:`);
    console.error(`   1. MongoDB Atlas credentials`);
    console.error(`   2. IP address whitelisted in Network Access`);
    console.error(`   3. Database user exists with correct password`);
    process.exit(1);
  }
};

module.exports = connectDB;
