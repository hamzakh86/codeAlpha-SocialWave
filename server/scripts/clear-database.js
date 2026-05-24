require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const UserPreference = require("../models/preference.model");
const Token = require("../models/token.model");
const Relationship = require("../models/relationship.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/socialwave";

mongoose.set("strictQuery", false);

async function clearDatabase() {
  try {
    console.log("Connecting to database to clear data...");
    await mongoose.connect(MONGODB_URI.trim(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    console.log("Cleaning collections...");
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await UserPreference.deleteMany({});
    await Token.deleteMany({});
    await Relationship.deleteMany({});
    
    console.log("\n==============================================");
    console.log("🧹 DATABASE CLEARED SUCCESSFULLY!");
    console.log("All users, posts, comments, and communities deleted.");
    console.log("==============================================\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
}

clearDatabase();
