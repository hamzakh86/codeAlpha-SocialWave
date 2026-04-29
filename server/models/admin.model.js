require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/admin.model");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    // ✅ Change ces valeurs
    const username = "admin";
    const password = "admin123";

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      process.exit(0);
    }

    const admin = new Admin({ username, password });
    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
