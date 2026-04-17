// Ajoutez cette route avec les autres routes (vers ligne 60)
app.post("/users/refresh-token", decodeToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    
    // Votre logique de rafraîchissement du token ici
    // Exemple simplifié:
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    
    // Générer un nouveau token
    const newAccessToken = generateToken(user); // Votre fonction de génération
    
    res.json({ 
      accessToken: newAccessToken,
      refreshToken: refreshToken // ou un nouveau refresh token
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
