require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/socialwave";

mongoose.set("strictQuery", false);

async function createAdminUser() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI.trim(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // L'utilisateur Admin sous forme de document User
    const adminUser = {
      name: "admin",
      email: "admin@gmail.com",
      password: "$2b$10$qWTPxTx9n/rt7E5ivUWwzOuIUU.eTOuXy4Q5uW.O4CexJbPOcEZe2", // password123 (ou votre mot de passe original)
      avatar: "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg",
      followers: [],
      following: [],
      location: "",
      bio: "",
      interests: "",
      role: "admin",
      savedPosts: [],
      isEmailVerified: true,
    };

    // Supprimer l'existant s'il y en a un avec le même email
    await User.deleteOne({ email: "admin@gmail.com" });

    // Insérer le document admin
    const newUser = new User(adminUser);
    await newUser.save();

    console.log("\n==============================================");
    console.log("👤 USER ADMIN CREATED SUCCESSFULLY!");
    console.log("Email: admin@gmail.com");
    console.log("Role: admin");
    console.log("==============================================\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
