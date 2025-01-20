const crypto = require('crypto');
const db = require('../db');  // Assure-toi que ce chemin est correct

// Créer un utilisateur
exports.create = async (req, res) => {
    try {
        const { username, email, password_hash, confirmPassword, admin } = req.body;

        // Vérification que les champs ne sont pas undefined ou null
        if (!password_hash || !confirmPassword) {
            return res.status(400).json({ message: "Le mot de passe et la confirmation sont requis." });
        }

        // Vérifier si le mot de passe et la confirmation sont identiques
        if (password_hash.trim() !== confirmPassword.trim()) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
        }

        // Vérifier si le nom d'utilisateur ou l'email existe déjà
        const userExists = await checkIfExists(username, email);
        if (userExists) {
            return res.status(400).json({ message: "Le nom d'utilisateur ou l'email est déjà pris." });
        }

        // Générer un sel pour le mot de passe
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = hashPassword(password_hash, salt);

        // Insérer l'utilisateur dans la base de données
        const query = `
            INSERT INTO Users (username, email, password_hash, salt, admin)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [username, email, hashedPassword, salt, admin], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
                return res.status(500).json({ message: "Erreur lors de l'inscription" });
            }
            return res.status(201).json({
                id: results.insertId,
                username,
                email,
                admin
            });
        });

    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        return res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    try {
        const { username, password_hash } = req.body;

        // Rechercher l'utilisateur dans la base de données
        const query = `SELECT * FROM Users WHERE username = ? LIMIT 1`;
        db.query(query, [username], (err, results) => {
            if (err) return res.status(500).json({ message: "Erreur de connexion" });
            if (results.length === 0) return res.status(400).json({ message: 'Utilisateur non trouvé' });

            const user = results[0];
            const hashedPassword = hashPassword(password_hash, user.salt);

            if (hashedPassword === user.password_hash) {
                req.session.user = { id: user.id, username: user.username, email: user.email, admin: user.admin };
                return res.status(200).json({ id: user.id, username: user.username, email: user.email, admin: user.admin });
            } else {
                return res.status(400).json({ message: 'Mot de passe incorrect' });
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur de connexion" });
    }
};

// Vérification si le nom d'utilisateur ou l'email existe déjà
async function checkIfExists(username, email) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Users WHERE username = ? OR email = ? LIMIT 1`;
        db.query(query, [username, email], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0);
        });
    });
}

// Fonction pour hacher le mot de passe avec le sel
function hashPassword(password_hash, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password_hash + salt); // Appliquer le sel au mot de passe
    return hash.digest('hex'); // Générer le hachage hexadécimal du mot de passe
}
