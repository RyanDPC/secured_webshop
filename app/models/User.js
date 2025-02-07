// models/User.js
const { db } = require("../db/database"); // Connexion db_user
const { rootConnection } = require("../db/data"); // Connexion root
class User {
  // Créer un nouvel utilisateur
  static async create({ username, email, password_hash, salt, admin }) {
    const query = `INSERT INTO users (username, email, password_hash,salt, admin) 
                   VALUES (?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
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

  // Trouver un utilisateur par son identifiant
  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]); // Retourne le premier utilisateur trouvé
      });
    });
  }

  // Trouver un utilisateur par son nom d'utilisateur
  static async findByUsername(username) {
    const query = `SELECT * FROM users WHERE username = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [username], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }

  // Rechercher des utilisateurs par nom d'utilisateur (pour la barre de recherche)
  static async searchByUsername(username) {
    const query = `SELECT id, username, profile_pic FROM users WHERE username LIKE ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [`${username}%`], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Mettre à jour les informations d'un utilisateur
  static async update(id, { username, email, password_hash, admin }) {
    const query = `UPDATE users SET username = ?, email = ?, password_hash = ?, admin = ? 
                   WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [username, email, password_hash, admin, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Afficher un utilisateur
  static async show(id) {
    return await User.findById(id);
  }
}

module.exports = User;
