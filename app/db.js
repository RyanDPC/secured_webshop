const mysql = require('mysql2');

// Configuration pour accéder à db_container sur le port exposé 6033
const db = mysql.createPool({
    host: 'db',         // Hôte pour le conteneur MySQL
    port: 3306,         // Port exposé par Docker (6033)
    user: 'Ryan',       // Nom d'utilisateur défini dans docker-compose
    password: 'test',   // Mot de passe défini dans docker-compose
    database: 'MyGameStore', // Nom de la base de données définie dans docker-compose
    waitForConnections: true, // Attendre la connexion avant de refuser les demandes
    connectionLimit: 10, // Nombre maximum de connexions simultanées dans le pool
    queueLimit: 0        // Pas de limite de requêtes en attente
});

// Exporter le pool de connexions
module.exports = db;
