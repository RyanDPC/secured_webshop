require('dotenv').config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require('../middlewares/auth');

// Créer un nouvel utilisateur
const create = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hacher le mot de passe
    const password_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Créer un utilisateur
    const user = await User.create({ username, email, password_hash, admin: false, profile_pic: "" });

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: user.insertId });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trouver l'utilisateur par son nom d'utilisateur
    const user = await User.findByUsername(username);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier le mot de passe
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer les tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800000
    });
    // Réponse avec les tokens
    console.log(`User ${user.username} logged in successfully`);
    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);
    res.status(200).json({
      message: "Connexion réussie",
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(400).json({ message: "Erreur de connexion", error });
  }
};

// Modifier un utilisateur
const edit = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, admin } = req.body;

    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Si le mot de passe est fourni, on le hache
    const password_hash = password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : user.password;

    await User.update(userId, { username, email, password_hash, admin });

    res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.delete(userId);
    if (!result) return res.status(404).json({ message: "Utilisateur non trouvé" });

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
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Masquer le mot de passe
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
