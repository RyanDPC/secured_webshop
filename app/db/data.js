const mysql = require("mysql2");

class DatabaseManager {
  static #config = {
    host: "db",
    port: 3306,
    user: "root",
    password: "root",
    database: "db_TechSolutions",
  };

  static #connection;

  // Méthode pour récupérer la connexion existante
  static async connectRoot() {
    if (this.#connection) return this.#connection;

    const connection = mysql.createConnection(this.#config);
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error("Root Connection Error:", err.message);
          return reject(err);
        }
        console.log("Connected to MySQL as root");
        this.#connection = connection; // Stocke la connexion pour les prochaines utilisations
        resolve(connection);
      });
    });
  }
}

module.exports = { DatabaseManager };
