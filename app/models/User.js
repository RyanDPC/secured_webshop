// models/User.js
const { db } = require("../db/database"); // Connexion db_user
const { rootConnection } = require("../db/data"); // Connexion root
class User {
  // Créer un nouvel utilisateur
  static async create({ username, email, password_hash, admin = false }) {
    const query = `INSERT INTO t_users (username, email, password_hash, admin) 
                   VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [username, email, password_hash, admin],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // Trouver un utilisateur par son identifiant
  static async findById(id) {
    const query = `SELECT * FROM t_users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]); // Retourne le premier utilisateur trouvé
      });
    });
  }

  // Trouver un utilisateur par son nom d'utilisateur
  static async findByUsername(username) {
    const query = `SELECT * FROM t_users WHERE username = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [username], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }

  // Rechercher des utilisateurs par nom d'utilisateur (pour la barre de recherche)
  static async searchByUsername(username) {
    const query = `SELECT id, username, profile_pic FROM t_users WHERE username LIKE ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [`${username}%`], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Mettre à jour les informations d'un utilisateur
  static async update(id, { username, email, password_hash, admin }) {
    const query = `UPDATE t_users SET username = ?, email = ?, password_hash = ?, admin = ? , profile_pic = ?
                   WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [username, email, password_hash, admin, profile_pic, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const query = `DELETE FROM t_users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Afficher un utilisateur
  static async show(username) {
    return await User.findByUsername(username);
  }
  static async showall() {
    const query = `SELECT * FROM t_users`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = User;
