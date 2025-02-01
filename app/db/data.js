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
      ensureDatabaseExists()
      .then(() => ensureUserExists())
      .then(() => resolve())
      .catch((err) => reject(err));
    });
  });
}

// Fonction pour vérifier si la base de données existe et la créer si nécessaire
function ensureDatabaseExists() {
  return new Promise((resolve, reject) => {
    rootConnection.query('CREATE DATABASE IF NOT EXISTS MiniGamesStore', (err, results) => {
      if (err) {
        console.error('Erreur lors de la création de la base de données:', err.stack);
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Fonction pour vérifier si l'utilisateur existe, et le créer s'il n'existe pas
function ensureUserExists() {
    return new Promise((resolve, reject) => {
      const user = 'db_user';
      const password = 'db_user_pass';
      const createUserQuery = `CREATE USER IF NOT EXISTS '${user}'@'%' IDENTIFIED BY '${password}';`;
      const grantPrivilegesQuery = `GRANT ALL ON MiniGamesStore.* TO '${user}'@'%' WITH GRANT OPTION;`;
  
      rootConnection.query(createUserQuery, (err, results) => {
        if (err) {
          console.error('Erreur lors de la création de l\'utilisateur:', err.stack);
          return reject(err);
        }
        rootConnection.query(grantPrivilegesQuery, (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'attribution des privilèges:', err.stack);
            return reject(err);
          }
          resolve(results);
        });
      });
    });
  }

module.exports = { connectRoot, rootConnection };