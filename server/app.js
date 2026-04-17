require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");
const useragent = require("express-useragent");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");

const app = express();

const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const PORT = process.env.PORT || 5000;

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connexion à la base de données avec gestion d'erreur
db.connect()
  .then(() => console.log("Connected to database successfully!"))
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    console.error("Please check your MongoDB connection string and IP whitelist");
  });

// Middlewares globaux
app.use(requestIp.mw());
app.use(useragent.express());

// Configuration CORS optimisée pour la production
app.use(cors({
  origin: true, // Autorise l'origine de la requête (utile pour Netlify)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");

// Routes publiques
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.get("/search", decodeToken, search);

// Routes API avec préfixe /api
app.use("/api/auth", contextAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/admin", adminRoutes);

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

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));
