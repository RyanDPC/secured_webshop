const mysql = require("mysql2");

// Configuration de la connexion avec l'utilisateur root pour injecter des données
const rootConfig = {
  host: "localhost", // Nom du service Docker pour MySQL
  port: 6033, // Port du conteneur
  user: "root", // Utilisateur MySQL
  password: "root", // Mot de passe pour rootesStore"
  database: "db_TechSolutions",
};

// Création de la connexion avec la base de données pour injection
const rootConnection = mysql.createConnection(rootConfig);

// Fonction pour s'assurer que l'utilisateur root peut se connecter et injecter des données
function connectRoot() {
  return new Promise((resolve, reject) => {
    // First connect without specifying a database
    const initialConfig = rootConfig ;
    delete initialConfig.database;

    const initialConnection = mysql.createConnection(initialConfig);

    initialConnection.connect((err) => {
      if (err) {
        console.error("Erreur de connexion en tant que root:", err.stack);
        return reject(err);
      }
      const createUserQuery = `CREATE USER IF NOT EXISTS 'db_user'@'%' IDENTIFIED BY 'db_user_pass'`;
      const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON db_TechSolutions.* TO 'db_user'@'%' WITH GRANT OPTION`;

      initialConnection.query(createUserQuery, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la création de l'utilisateur:",
            err.stack
          );
          return reject(err);
        }

        initialConnection.query(grantPrivilegesQuery, (err) => {
          if (err) {
            console.error(
              "Erreur lors de l'attribution des privilèges:",
              err.stack
            );
            return reject(err);
          }

          // Now connect to the database
          initialConnection.query("USE db_TechSolutions", (err) => {
            if (err) {
              console.error(
                "Erreur lors du changement de base de données:",
                err.stack
              );
              return reject(err);
            }
            resolve();
          });
        });
      });
    });
  });
}

module.exports = { connectRoot, rootConnection };
