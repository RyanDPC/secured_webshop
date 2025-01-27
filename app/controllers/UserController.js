// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Créer un utilisateur
exports.create = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, admin } = req.body;

    // Vérification que les champs ne sont pas undefined ou null
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Le mot de passe et la confirmation sont requis." });
    }

    // Vérifier si les mots de passe correspondent
    if (password.trim() !== confirmPassword.trim()) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findByUsername(username);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur est déjà pris." });
    }

    // Générer un sel pour le mot de passe
    const salt = await bcrypt.genSalt(10);
    // Hacher le mot de passe avec le sel
    const password_hash = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    await User.create({
      username,
      email,
      password_hash: password_hash,
      salt,
      admin: admin || false,
    });

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      username,
      email,
      admin: admin || false,
    });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    return res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier que les données sont bien envoyées
    console.log(
      "Données de la requête reçues : username =",
      username,
      ", password =",
      password
    );

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Log pour vérifier si on a bien récupéré le mot de passe haché
    console.log(
      "Mot de passe récupéré de la base de données :",
      user.password_hash
    );

    // Comparer le mot de passe fourni par l'utilisateur avec le mot de passe haché
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Mot de passe fourni :", password);
    console.log(
      "Mot de passe haché dans la base de données :",
      user.password_hash
    );

    if (isMatch) {
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
    console.error("Erreur lors de la connexion :", err);
    return res.status(500).json({ message: "Erreur de connexion" });
  }
};

// Affichage du profil de l'utilisateur
exports.showProfile = async (req, res) => {
  try {
    const userId = req.user.id; // L'utilisateur est déjà authentifié, nous avons son ID dans req.user

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.json(user);
  } catch (err) {
    console.error("Erreur lors de l'affichage du profil :", err);
    res.status(500).send("Erreur serveur");
  }
};

// Recherche d'utilisateurs
exports.searchUsers = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ message: 'Paramètre "username" requis pour la recherche.' });
  }

  try {
    const users = await User.searchByUsername(username);

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    res.json({ users });
  } catch (err) {
    console.error("Erreur lors de la recherche des utilisateurs :", err);
    return res
      .status(500)
      .json({ message: "Erreur lors de la recherche des utilisateurs" });
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
