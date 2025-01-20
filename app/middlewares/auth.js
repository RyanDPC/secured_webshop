// Importer les modules nécessaires
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" }); // Charger les variables d'environnement

// Vérification de l'existence des secrets
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error(
    "Erreur : Les variables JWT_SECRET ou REFRESH_TOKEN_SECRET ne sont pas définies."
  );
  process.exit(1); // Arrête l'application si les clés ne sont pas définies
}

// Générer un token d'accès (valable pour 15 minutes)
exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username }, // Assurez-vous d'utiliser _id de manière cohérente
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Générer un token de rafraîchissement (valable pour 7 jours)
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Middleware pour authentifier le token d'accès
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide." });
    }

    req.user = {
      userId: user.id,
      username: user.username,
    };

    next();
  });
};
