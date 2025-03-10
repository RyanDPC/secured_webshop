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
  // Méthode pour créer la table t_users si elle n'existe pas
  static async createTable() {
    const connection = await this.connectRoot();
    const query = `
      CREATE TABLE IF NOT EXISTS t_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT FALSE,
        profile_pic VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return new Promise((resolve, reject) => {
      connection.query(query, (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
          return reject(err);
        }
        console.log("Table t_users is ready");
        resolve();
      });
    });
  }
}

module.exports = { DatabaseManager };
