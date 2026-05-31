require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");
const useragent = require("express-useragent");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
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
const { refreshToken } = require("./controllers/user.controller");

const app = express();
app.set("trust proxy", 1); // ✅ Fix Render proxy

// ==================== MIDDLEWARES ====================
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Compression gzip : réduit la taille des réponses JSON de 60-80%
app.use(compression());

app.use(requestIp.mw());
app.use(useragent.express());

// ✅ Morgan en mode 'combined' en production (logs détaillés), 'dev' en développement
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(passport.initialize());
require("./config/passport.js");

// ==================== FICHIERS STATIQUES ====================
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use("/assets/userAvatars", express.static(__dirname + "/assets/userAvatars"));

// ==================== ROUTES ====================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SocialWave API is running!",
    routes: ["/server-status", "/refresh-token", "/users", "/posts", "/auth", "/communities", "/admin", "/search"]
  });
});

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.post("/refresh-token", refreshToken);

// Routes principales de l'API
app.get("/search", decodeToken, search);
app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);

// ==================== GESTION DES ERREURS ====================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    requestedUrl: req.url
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
});

// ==================== BASE DE DONNÉES ====================
// Remove BOM if present and trim the URI
const getDbUri = () => {
  const uri = process.env.MONGODB_URI || process.env["\uFEFFMONGODB_URI"];
  return uri ? uri.trim() : "";
};

const dbUri = getDbUri();

// ✅ Options dépréciées supprimées (Mongoose 6+ les ignore)
const db = new Database(dbUri);

db.connect()
  .then(() => console.log("✅ Connected to database successfully!"))
  .catch((err) => {
    console.error("❌ Error connecting to database:", err.message);
  });

// ==================== DÉMARRAGE DU SERVEUR ====================
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
