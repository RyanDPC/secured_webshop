const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { db } = require("../db/database"); // Assurez-vous que vous importez correctement la connexion à la DB

// Classe User qui gère les opérations SQL
class User {
  static create({ username, email, password_hash, salt, admin }) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (username, email, password_hash, salt, admin) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [username, email, password_hash, salt, admin],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE username = ?";
      db.query(query, [username], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.query(query, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }

  static searchByUsername(username) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT id, username, profile_pic FROM users WHERE username LIKE ?";
      db.query(query, [`${username}%`], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = User;
