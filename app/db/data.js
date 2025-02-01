const mysql = require("mysql2");

// Configuration de la connexion avec l'utilisateur root pour injecter des données
const rootConfig = {
  host: "localhost",  // Nom du service Docker pour MySQL
  port: 6033,  // Port du conteneur
  user: "root",  // Utilisateur MySQL
  password: "root",  // Mot de passe pour root
  database: "MiniGamesStore"  // Base de données à utiliser
};

// Création de la connexion avec la base de données pour injection
const rootConnection = mysql.createConnection(rootConfig);

// Fonction pour s'assurer que l'utilisateur root peut se connecter et injecter des données
function connectRoot() {
  return new Promise((resolve, reject) => {
    rootConnection.connect((err) => {
      if (err) {
        console.error("Erreur de connexion en tant que root:", err.stack);
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = { connectRoot, rootConnection };
