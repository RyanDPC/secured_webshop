const mysql = require("mysql2");

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: "localhost", // votre hôte, par exemple localhost
  port: 6033,
  user: "db_user", // votre utilisateur MySQL
  password: "db_user_pass", // votre mot de passe MySQL
});

// Vérification et création de la base de données si elle n'existe pas
db.query("CREATE DATABASE IF NOT EXISTS MiniGamesStore", (err, result) => {
  if (err) {
    console.error(
      "Erreur lors de la création de la base de données:",
      err.stack
    );
    return;
  }
  console.log("Base de données MiniGamesStore prête.");
  // Sélectionner la base de données
  db.changeUser({ database: "MiniGamesStore" }, (err) => {
    if (err) {
      console.error(
        "Erreur lors de la sélection de la base de données:",
        err.stack
      );
      return;
    }
    console.log("Base de données sélectionnée : MiniGamesStore");
    // Créer la table 'users' si elle n'existe pas
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT false,
        profile_pic VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table 'users':",
          err.stack
        );
        return;
      }
      console.log("Table 'users' prête.");
    });
  });
});

// Fonction d'initialisation de la base de données
function initDb() {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Erreur de connexion à la base de données:", err.stack);
        return reject(err);
      }
      console.log("Connecté à la base de données avec l'ID", db.threadId);
      resolve();
    });
  });
}

// Exportation de la connexion et de la fonction d'initialisation
module.exports = { db, initDb };
