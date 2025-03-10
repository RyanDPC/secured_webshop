const { DatabaseManager } = require("../db/data");

class User {
  // Base query execution helper
  static async #executeQuery(query, params = []) {
    const connection = await DatabaseManager.connectRoot();
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Create new user
  static async create({
    username,
    email,
    password_hash,
    admin = false,
    profile_pic = "",
  }) {
    const query = `INSERT INTO t_users (username, email, password_hash, admin, profile_pic) 
                   VALUES (?, ?, ?, ?, ?)`;
    return await this.#executeQuery(query, [
      username,
      email,
      password_hash,
      admin,
      profile_pic,
    ]);
  }

  // Update user
  static async update(id, { username, email, password_hash, admin }) {
    const query = `UPDATE t_users 
                   SET username = ?, 
                       email = ?, 
                       password_hash = ?, 
                       admin = ?
                   WHERE id = ?`;
    return await this.#executeQuery(query, [
      username,
      email,
      password_hash,
      admin,
      id,
    ]);
  }

  // Delete user
  static async delete(id) {
    const query = `DELETE FROM t_users WHERE id = ?`;
    return await this.#executeQuery(query, [id]);
  }

  // Find user by ID
  static async findById(id) {
    const query = `SELECT * FROM t_users WHERE id = ?`;
    const rows = await this.#executeQuery(query, [id]);
    return rows[0];
  }

  // Find user by username
  static async findByUsername(username) {
    const query = `SELECT * FROM t_users WHERE username = ?`;
    const rows = await this.#executeQuery(query, [username]);
    return rows[0];
  }

  // Search users by username
  static async searchByUsername(username) {
    const query = `SELECT id, username, email 
                   FROM t_users 
                   WHERE username LIKE ?`;
    const rows = await this.#executeQuery(query, [`%${username}%`]);
    return rows.filter((user) =>
      user.username.toLowerCase().includes(username.toLowerCase())
    );
  }

  // Get all users
  static async showAll() {
    const query = `SELECT * FROM t_users`;
    return await this.#executeQuery(query);
  }
}

module.exports = User;
