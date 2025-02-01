const mysql = require("mysql2");

// Configuration de la connexion avec l'utilisateur db_user
const dbConfig = {
  host: "localhost",  // Nom du service Docker pour MySQL
  port: 6033,  // Port du conteneur
  user: "db_user",  // Utilisateur MySQL
  password: "db_user_pass",  // Mot de passe de l'utilisateur MySQL
  database: "MiniGamesStore"  // Base de données à utiliser
};

// Création de la connexion avec la base de données
const db = mysql.createConnection(dbConfig);

// Fonction de connexion à la base de données
function connectDb() {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Erreur de connexion à la base de données:", err.stack);
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = { connectDb, db };
