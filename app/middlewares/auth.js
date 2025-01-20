// Exemple avec Express.js
const jwt = require("jsonwebtoken"); // Bibliothèque pour travailler avec JWT

// Middleware pour vérifier l'authentification
exports.checkAuth = (req, res, next) => {
  // Récupère le token depuis les headers de la requête (par exemple, Authorization: Bearer <token>)
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  // Si le token n'existe pas ou n'est pas valide
  if (!token) {
    return res.redirect("/login"); // Redirige vers la page de connexion
  }

  // Vérifie si le token est valide
  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.redirect("/login"); // Si le token est invalide, redirige vers la page de connexion
    }

    // Si le token est valide, on ajoute les infos utilisateur à la requête et on passe au middleware suivant
    req.user = decoded;
    next(); // Passe au middleware suivant ou à la route
  });
};
