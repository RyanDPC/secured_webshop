const mysql = require("mysql2");

// Configuration de la connexion avec l'utilisateur db_user
const dbConfig = {
  host: "localhost", // Nom du service Docker pour MySQL
  port: 6033, // Port du conteneur
  user: "db_user", // Utilisateur MySQL
  password: "db_user_pass", // Mot de passe de l'utilisateur MySQL
  database: "db_TechSolutions", // Base de données à utiliser
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
      createUsersTable()
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
}

// Fonction pour créer la table users
function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS t_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      admin BOOLEAN DEFAULT FALSE,
      profile_pic VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table users:",
          err.stack
        );
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = { connectDb, createUsersTable, db };
