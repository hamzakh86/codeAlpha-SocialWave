const jwt = require("jsonwebtoken");

/**
 * Middleware pour décoder et vérifier un JWT.
 * NOTE: Ce middleware pour décoder JWT n'est pas nécessaire avec la stratégie JWT de Passport.
 * Passport gère le décodage et l'extraction de l'utilisateur automatiquement.
 */

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Vérification de la présence du header avant le split (évitait un crash)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = decodeToken;
