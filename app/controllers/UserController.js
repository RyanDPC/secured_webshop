const crypto = require('crypto');

class Users {
    // Créer un utilisateur
    static async create({ username, password, email }) {
        const salt = crypto.randomBytes(16).toString('hex'); // Générer un sel aléatoire pour sécuriser le mot de passe
        const hashedPassword = await hashPassword(password, salt);

        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO users (username, password, email, salt)
                VALUES (?, ?, ?, ?)
            `;
            db.run(query, [username, hashedPassword, email, salt], function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, username, email });
            });
        });
    }

    // Modifier un utilisateur
    static async modify({ userId, username, password, email }) {
        const salt = crypto.randomBytes(16).toString('hex'); // Générer un nouveau sel
        const hashedPassword = await hashPassword(password, salt);

        return new Promise((resolve, reject) => {
            const query = `
                UPDATE users 
                SET username = ?, password = ?, email = ?, salt = ?
                WHERE id = ?
            `;
            db.run(query, [username, hashedPassword, email, salt, userId], function (err) {
                if (err) return reject(err);
                resolve({ id: userId, username, email });
            });
        });
    }

    // Supprimer un utilisateur
    static async delete(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM users WHERE id = ?
            `;
            db.run(query, [userId], function (err) {
                if (err) return reject(err);
                resolve({ message: 'User deleted', id: userId });
            });
        });
    }

    // Connexion d'un utilisateur (vérification du mot de passe)
    static async login({ username, password }) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
            db.get(query, [username], async (err, user) => {
                if (err) return reject(err);
                if (!user) return reject({ message: 'Utilisateur non trouvé' });

                const hashedPassword = await hashPassword(password, user.salt);

                if (hashedPassword === user.password) {
                    resolve({ id: user.id, username: user.username, email: user.email });
                } else {
                    reject({ message: 'Mot de passe incorrect' });
                }
            });
        });
    }
}

// Fonction pour hacher le mot de passe avec le sel
async function hashPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt); // Appliquer le sel au mot de passe
    return hash.digest('hex'); // Générer le hachage hexadécimal du mot de passe
}

module.exports = Users;
