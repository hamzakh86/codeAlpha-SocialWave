require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");
const useragent = require("express-useragent");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

// Routes imports
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");

const app = express();

// ==================== MIDDLEWARES ====================
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(requestIp.mw());
app.use(useragent.express());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");

// ==================== FICHIERS STATIQUES ====================
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use("/assets/userAvatars", express.static(__dirname + "/assets/userAvatars"));

// ==================== ROUTES ====================

// Route racine (pour tester)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SocialWave API is running!",
    routes: ["/server-status", "/refresh-token", "/users", "/posts", "/auth", "/communities", "/admin", "/search"]
  });
});

// Route de statut du serveur
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

// Route refresh token
app.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    console.log("Refresh token reçu");

    // TODO: Ajouter votre logique de vérification du refresh token
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

// Routes principales de l'API
app.get("/search", decodeToken, search);
app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);

// ==================== GESTION DES ERREURS ====================

// Route 404 - Page non trouvée
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

// ==================== BASE DE DONNÉES ====================
const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect()
  .then(() => console.log("✅ Connected to database successfully!"))
  .catch((err) => {
    console.error("❌ Error connecting to database:", err.message);
  });

// ==================== DÉMARRAGE DU SERVEUR ====================
// CRUCIAL POUR RENDER : Écouter sur 0.0.0.0 et utiliser le port fourni
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server up and running on port ${PORT}!`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at: https://codealpha-socialwave.onrender.com`);
});

// ==================== ARRÊT PROPRE ====================
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
