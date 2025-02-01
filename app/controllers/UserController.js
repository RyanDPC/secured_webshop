// controllers/UserController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Créer un nouvel utilisateur
const create = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    
    const user = await User.create({ username, email, password_hash, salt, admin: false, profile_pic: "", created_at: new Date(), updated_at: new Date() });  
    res.status(201).json({ message: "Utilisateur créé avec succès", userId: user.insertId });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
  }
};

// Se connecter (vérification email et mot de passe)
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Créer un JWT
    const token = jwt.sign({ id: user.id, username: user.username }, "SECRET_KEY", { expiresIn: "1h" });
    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};

// Modifier un utilisateur
const edit = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, admin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const password_hash = password ? bcrypt.hashSync(password, 10) : user.password_hash;
    const salt = password ? bcrypt.genSaltSync(10) : user.salt;

    await User.update(userId, { username, email, password_hash, salt, admin });
    res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.delete(userId);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
  }
};

// Afficher un utilisateur
const show = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.show(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Masquer le mot de passe en utilisant des étoiles
    const userData = { ...user, password_hash: "*****" };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'affichage de l'utilisateur", error });
  }
};

// Recherche par nom d'utilisateur
const search = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.searchByUsername(username);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche des utilisateurs", error });
  }
};

module.exports = { create, login, edit, deleteUser, show, search };
