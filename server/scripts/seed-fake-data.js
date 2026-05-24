require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const UserPreference = require("../models/preference.model");
const Token = require("../models/token.model");
const Relationship = require("../models/relationship.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/socialwave";

mongoose.set("strictQuery", false);

async function seed() {
  try {
    console.log("Connecting to database at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI.trim(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // 1. Clear existing database collections to ensure fresh mock state
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await UserPreference.deleteMany({});
    await Token.deleteMany({});
    await Relationship.deleteMany({});
    console.log("🧹 Database cleared.");

    // 2. Create Users
    console.log("Seeding Users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const usersData = [
      {
        name: "Khaled Hamza",
        email: "demo@tunisiatravel.com",
        password: hashedPassword,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        location: "Tunis, Tunisia",
        bio: "Explorer, photographer, and lover of Tunisian sun and sand. Let's share some amazing places! 🇹🇳✈️",
        interests: "Beach, History, Sahara, Couscous, Coffee, Hiking",
        role: "moderator",
        isEmailVerified: true
      },
      {
        name: "Amine Belhadj",
        email: "amine@tunisiatravel.com",
        password: hashedPassword,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        location: "Douz, Tunisia",
        bio: "Desert guide from the gates of the Sahara. Ask me anything about camel treks and stargazing! 🏜️⭐",
        interests: "Sahara, Camping, Tea, Camel Treks, Stargazing",
        role: "moderator",
        isEmailVerified: true
      },
      {
        name: "Sarah Ben Ali",
        email: "sarah@tunisiatravel.com",
        password: hashedPassword,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        location: "Carthage, Tunisia",
        bio: "Archaeologist & history buff. Let's dig into the glorious Punic and Roman past of Tunisia! 🏛️🏺",
        interests: "History, Archaeology, Ruins, Museums, Photography",
        role: "moderator",
        isEmailVerified: true
      },
      {
        name: "Yasmine Mansour",
        email: "yasmine@tunisiatravel.com",
        password: hashedPassword,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        location: "Sidi Bou Said, Tunisia",
        bio: "Beach lover 🌊 and boutique hotel owner in the heart of the blue and white village.",
        interests: "Beach, Coffee, Sidi Bou Said, Mediterranean, Art",
        role: "general",
        isEmailVerified: true
      },
      {
        name: "Malek Trabelsi",
        email: "malek@tunisiatravel.com",
        password: hashedPassword,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        location: "Ain Draham, Tunisia",
        bio: "Hiking Tabarka forests & climbing Ain Draham mountains! Nature is my sanctuary. 🌲🥾",
        interests: "Hiking, Forest, Camping, Nature, Mountain, Tabarka",
        role: "general",
        isEmailVerified: true
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(`✅ Seeded ${users.length} users successfully!`);

    // Create UserPreferences for each user (so context auth features are disabled or pre-configured correctly)
    for (const u of users) {
      await new UserPreference({
        user: u._id,
        enableContextBasedAuth: false,
      }).save();
    }

    // 3. Create Communities (Tunisian Destinations)
    console.log("Seeding Communities (Destinations)...");
    const communitiesData = [
      {
        name: "Sidi Bou Said",
        description: "The legendary blue and white village perched on the cliff overlooking Carthage gulf. Famous for its art, traditional cafes, and stunning Mediterranean views.",
        banner: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        members: users.map(u => u._id),
        moderators: [users[3]._id] // Yasmine is moderator of Sidi Bou Said
      },
      {
        name: "Djerba Island",
        description: "Djerba la Douce, the island of dreams. Sandy beaches, Houmt Souk market, historic Synagogue, and the Djerbahood street art village.",
        banner: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=1200&q=80",
        members: users.map(u => u._id),
        moderators: [users[0]._id] // Khaled is moderator of Djerba Island
      },
      {
        name: "Sahara Desert",
        description: "The golden gates of the Sahara. Golden sand dunes, breathtaking desert sunsets, Star Wars filming locations (Mos Espa), and beautiful oases.",
        banner: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
        members: users.map(u => u._id),
        moderators: [users[1]._id] // Amine is moderator of Sahara
      },
      {
        name: "Carthage ruins & La Marsa",
        description: "Explore the ancient Punic and Roman archaeological ruins of Carthage, and relax by the trendy beaches and chic cafes of La Marsa.",
        banner: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
        members: users.map(u => u._id),
        moderators: [users[2]._id] // Sarah is moderator of Carthage
      },
      {
        name: "Tabarka & Ain Draham",
        description: "Where the green mountains meet the turquoise sea. Perfect for hiking, forest camping, coral diving, and seeing the needle rocks.",
        banner: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
        members: users.map(u => u._id),
        moderators: [users[4]._id] // Malek is moderator of Tabarka
      }
    ];

    const communities = await Community.insertMany(communitiesData);
    console.log(`✅ Seeded ${communities.length} destinations successfully!`);

    // 4. Create Posts
    console.log("Seeding Posts...");
    const postsData = [
      {
        content: "Unforgettable sunset over the golden dunes of Douz tonight! 🌅 The Sahara never fails to amaze. If anyone wants to join our next camel caravan trek, let me know! #desert #sahara #tunisia #douz",
        fileUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80",
        fileType: "image/jpeg",
        community: communities[2]._id, // Sahara
        user: users[1]._id, // Amine
        likes: [users[0]._id, users[3]._id] // Liked by Khaled & Yasmine
      },
      {
        content: "Spent the morning exploring the Antonine Baths in Carthage. 🏛️ Walking through these Roman ruins makes you feel the immense history of this land. We must preserve this treasure! #carthage #history #archaeology #tunisia",
        fileUrl: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?auto=format&fit=crop&w=1200&q=80",
        fileType: "image/jpeg",
        community: communities[3]._id, // Carthage
        user: users[2]._id, // Sarah
        likes: [users[0]._id, users[1]._id, users[4]._id] // Liked by Khaled, Amine, Malek
      },
      {
        content: "Morning coffee at Cafe des Delices with the classic blue and white backdrop. ☕️💙 There is a light breeze and the sea is calm. Good morning from Tunisia's most beautiful village! #sidibousaid #coffee #view #mediterranean",
        fileUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        fileType: "image/jpeg",
        community: communities[0]._id, // Sidi Bou Said
        user: users[3]._id, // Yasmine
        likes: [users[0]._id, users[2]._id]
      },
      {
        content: "Deep in the oak forests of Ain Draham! 🌲 Splendid foggy morning, clean mountain air. Perfect spot for wild camping. Who is up for a hike next weekend? #hiking #nature #aindraham #adventure",
        fileUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        fileType: "image/jpeg",
        community: communities[4]._id, // Tabarka & Ain Draham
        user: users[4]._id, // Malek
        likes: [users[0]._id, users[1]._id, users[2]._id]
      },
      {
        content: "Walking through Djerbahood! 🎨 The murals painted on the walls of Erriadh village are absolutely spectacular. Art and history blending beautifully under the Djerbian sun. ☀️ #djerba #art #streetart #djerbahood",
        fileUrl: "https://images.unsplash.com/photo-1598908314732-07113901949e?auto=format&fit=crop&w=1200&q=80",
        fileType: "image/jpeg",
        community: communities[1]._id, // Djerba Island
        user: users[0]._id, // Khaled
        likes: [users[1]._id, users[2]._id, users[3]._id]
      }
    ];

    const posts = await Post.insertMany(postsData);
    console.log(`✅ Seeded ${posts.length} travel posts!`);

    // 5. Create Comments
    console.log("Seeding Comments...");
    const commentsData = [
      {
        content: "Djerbahood is indeed a masterpiece! Which mural was your favorite?",
        user: users[2]._id, // Sarah
        post: posts[4]._id // Khaled's post
      },
      {
        content: "The giant Arabic calligraffiti! It's absolutely stunning.",
        user: users[0]._id, // Khaled
        post: posts[4]._id // Khaled's post
      },
      {
        content: "Wow, this desert sunset looks dreamlike! I need to plan a trip down south soon.",
        user: users[3]._id, // Yasmine
        post: posts[0]._id // Amine's post
      },
      {
        content: "You are welcome anytime, Yasmine! I will prepare the best desert mint tea for you 🍵",
        user: users[1]._id, // Amine
        post: posts[0]._id // Amine's post
      },
      {
        content: "Carthage is magical! Did you check the museum up on Byrsa hill?",
        user: users[0]._id, // Khaled
        post: posts[1]._id // Sarah's post
      },
      {
        content: "Yes, Khaled! The panoramic view from Byrsa is incredible too.",
        user: users[2]._id, // Sarah
        post: posts[1]._id // Sarah's post
      }
    ];

    const seededComments = await Comment.insertMany(commentsData);

    // Link comments back to their respective posts
    for (const comment of seededComments) {
      await Post.findByIdAndUpdate(comment.post, {
        $push: { comments: comment._id }
      });
    }

    console.log(`✅ Seeded ${seededComments.length} interactive comments successfully!`);
    console.log("\n==============================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==============================================");
    console.log("Demo Credentials:");
    console.log("📧 Email:    demo@tunisiatravel.com");
    console.log("🔑 Password: password123");
    console.log("==============================================\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seed();
