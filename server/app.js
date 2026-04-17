require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");
const useragent = require("express-useragent");
const cors = require("cors");           // ← 1. Importer cors
const morgan = require("morgan");        // ← 2. Importer morgan
const passport = require("passport");    // ← 3. Importer passport

// Vos routes imports
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");

const app = express();  // ← Créer app APRES tous les imports

// Configuration CORS - MAINTENANT cors est défini
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Les autres middlewares
app.use(requestIp.mw());
app.use(useragent.express());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");

// Routes statiques
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use("/assets/userAvatars", express.static(__dirname + "/assets/userAvatars"));

// Route de statut
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

// ROUTE REFRESH TOKEN
app.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    
    console.log("Refresh token reçu");
    
    // TODO: Ajouter votre logique de vérification
    res.json({ 
      accessToken: "nouveau_token_temp",
      refreshToken: refreshToken,
      result: { _id: "test", name: "Test User" }
    });
    
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Vos routes existantes
app.get("/search", decodeToken, search);
app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found", 
    requestedUrl: req.url 
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: err.message 
  });
});

// Base de données et démarrage
const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect()
  .then(() => console.log("Connected to database successfully!"))
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
