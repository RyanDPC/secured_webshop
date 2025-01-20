const mysql = require("mysql2");

// Configuration pour accéder à db_container sur le port exposé 6033
const db = mysql.createPool({
  host: "localhost", // Hôte pour le conteneur MySQL
  port: 6033, // Port exposé par Docker (6033)
  user: "db_user", // Nom d'utilisateur défini dans docker-compose
  password: "db_user_pass", // Mot de passe défini dans docker-compose
  database: "MiniGamesStore", // Nom de la base de données définie dans docker-compose
  waitForConnections: true, // Attendre la connexion avant de refuser les demandes
  connectionLimit: 10, // Nombre maximum de connexions simultanées dans le pool
  queueLimit: 0, // Pas de limite de requêtes en attente
});

// Test de la connexion à la base de données
db.getConnection((err, connection) => {
  if (err) {
    console.error("Erreur de connexion à la base de données: ", err.message);
  } else {
    console.log("Connexion réussie à la base de données");
    connection.release(); // Libérer la connexion une fois qu'elle n'est plus nécessaire
  }
});

// Exporter le pool de connexions
module.exports = db;
