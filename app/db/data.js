const mysql = require("mysql2");

// Configuration de la connexion avec l'utilisateur root pour injecter des données
const rootConfig = {
  host: "localhost",  // Nom du service Docker pour MySQL
  port: 6033,  // Port du conteneur
  user: "root",  // Utilisateur MySQL
  password: "root",  // Mot de passe pour rootesStore"  // Base de données à utiliser
};

// Création de la connexion avec la base de données pour injection
const rootConnection = mysql.createConnection(rootConfig);

// Fonction pour s'assurer que l'utilisateur root peut se connecter et injecter des données
function connectRoot() {
  return new Promise((resolve, reject) => {
    // First connect without specifying a database
    const initialConfig = { ...rootConfig };
    delete initialConfig.database;
    
    const initialConnection = mysql.createConnection(initialConfig);
    
    initialConnection.connect((err) => {
      if (err) {
        console.error("Erreur de connexion en tant que root:", err.stack);
        return reject(err);
      }
      
      // Create database and user
      initialConnection.query('CREATE DATABASE IF NOT EXISTS MiniGamesStore', (err) => {
        if (err) {
          console.error('Erreur lors de la création de la base de données:', err.stack);
          return reject(err);
        }
        
        const user = 'db_user';
        const password = 'db_user_pass';
        const createUserQuery = `CREATE USER IF NOT EXISTS '${user}'@'%' IDENTIFIED BY '${password}'`;
        const grantPrivilegesQuery = `GRANT ALL ON MiniGamesStore.* TO '${user}'@'%' WITH GRANT OPTION`;
        
        initialConnection.query(createUserQuery, (err) => {
          if (err) {
            console.error('Erreur lors de la création de l\'utilisateur:', err.stack);
            return reject(err);
          }
          
          initialConnection.query(grantPrivilegesQuery, (err) => {
            if (err) {
              console.error('Erreur lors de l\'attribution des privilèges:', err.stack);
              return reject(err);
            }
            
            // Now connect to the database
            initialConnection.query('USE MiniGamesStore', (err) => {
              if (err) {
                console.error('Erreur lors du changement de base de données:', err.stack);
                return reject(err);
              }
              resolve();
            });
          });
        });
      });
    });
  });
}

module.exports = { connectRoot, rootConnection };