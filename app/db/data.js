const mysql = require("mysql2");

class DatabaseManager {
  static #config = {
    host: "localhost",
    port: 6033,
    user: "root",
    password: "root"
  };

  static #createConnection(config) {
    return mysql.createConnection(config);
  }

  static async #executeQuery(connection, query) {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, result) => {
        if (err) {
          console.error(`Query Error: ${err.message}`);
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  static async connectRoot() {
    try {
      // Create initial connection
      const connection = this.#createConnection(this.#config);
      
      // Connect to MySQL
      await new Promise((resolve, reject) => {
        connection.connect(err => {
          if (err) {
            console.error("Root Connection Error:", err.message);
            reject(err);
          }
          resolve();
        });
      });

      // Create database if not exists
      await this.#executeQuery(
        connection,
        `CREATE DATABASE IF NOT EXISTS db_TechSolutions`
      );

      // Create user and grant privileges
      await this.#executeQuery(
        connection,
        `CREATE USER IF NOT EXISTS 'db_user'@'%' IDENTIFIED BY 'db_user_pass'`
      );

      await this.#executeQuery(
        connection,
        `GRANT ALL PRIVILEGES ON db_TechSolutions.* TO 'db_user'@'%' WITH GRANT OPTION`
      );

      // Create users table
      await this.#executeQuery(connection, `USE db_TechSolutions`);
      await this.#executeQuery(connection, `
        CREATE TABLE IF NOT EXISTS t_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          admin BOOLEAN DEFAULT FALSE,
          profile_pic VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      return connection;
    } catch (error) {
      console.error("Database Setup Error:", error.message);
      throw error;
    }
  }
}

module.exports = {DatabaseManager};