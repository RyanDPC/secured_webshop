const { Sequelize, User } = require("../db/sequelize");
const crypto = require("crypto");
const { Op } = require("sequelize");
// Créer un utilisateur
exports.create = async (req, res) => {
  try {
    const { username, email, password_hash, confirmPassword, admin } = req.body;

    // Vérification que les champs ne sont pas undefined ou null
    if (!password_hash || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Le mot de passe et la confirmation sont requis." });
    }

    // Vérifier si le mot de passe et la confirmation sont identiques
    if (password_hash.trim() !== confirmPassword.trim()) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Vérifier si le nom d'utilisateur ou l'email existe déjà
    const userExists = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email }],
      },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur ou l'email est déjà pris." });
    }

    // Générer un sel pour le mot de passe
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = User.hashPassword(password_hash, salt);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      salt,
      admin,
    });

    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      admin: newUser.admin,
    });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    return res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { username, password_hash } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérification du mot de passe
    const hashedPassword = User.hashPassword(password_hash, user.salt);

    if (hashedPassword === user.password_hash) {
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      };
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      });
    } else {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur de connexion" });
  }
};

// Affichage du profil de l'utilisateur
exports.showProfile = async (req, res) => {
  try {
    const userId = req.user.id; // L'utilisateur est déjà authentifié, nous avons son ID dans req.user
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.render("profile", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

// Recherche d'utilisateurs
exports.searchUsers = async (req, res) => {
  const { username } = req.query;
  console.log("Requête reçue pour la recherche :", username);

  if (!username) {
    return res
      .status(400)
      .json({ message: 'Paramètre "username" requis pour la recherche.' });
  }

  try {
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `${username}%`,
        },
      },
    });

    if (users.length === 0) {
      console.log(`Aucun utilisateur trouvé avec le nom : ${username}`);
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    console.log("Résultat de la recherche :", users);
    res.json({ users });
  } catch (err) {
    console.error("Erreur lors de la recherche des utilisateurs :", err);
    return res
      .status(500)
      .json({ error: "Erreur lors de la recherche des utilisateurs." });
  }
};

// Déconnexion de l'utilisateur
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Déconnexion réussie." });
  });
};
