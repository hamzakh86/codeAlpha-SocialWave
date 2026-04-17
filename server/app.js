require("dotenv").config();
const express = require("express");
const requestIp = require("request-ip");
const useragent = require("express-useragent");
// ... tous les autres require

const app = express();  // <-- 1. D'abord, créer 'app'

// ... ensuite les middlewares
app.use(requestIp.mw());
app.use(useragent.express());

// Configuration CORS
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");

// --- ROUTES ---
// Route de statut
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

// ✅ AJOUTEZ LA ROUTE ICI (après la création de 'app' et avant les autres routes)
app.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    
    // Pour l'instant, une réponse simple pour tester
    console.log("Refresh token reçu:", refreshToken);
    
    // TODO: Ajouter votre logique de vérification du refresh token
    res.json({ 
      accessToken: "nouveau_token_temp",
      refreshToken: refreshToken,
      result: { _id: "test", name: "Utilisateur test" }
    });
    
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Ensuite, vos routes existantes
app.get("/search", decodeToken, search);
app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);  // <-- Note: vous n'avez PAS besoin de "/users/refresh-token" ici
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);

// Gestion des erreurs 404 et 500
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", requestedUrl: req.url });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));
