const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/auth");
const User = require("../models/User");

dotenv.config();

class UserController {
  // Configuration des cookies
  static #cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3600000, // 1 heure
  };

  // Register - Inscription d'un nouvel utilisateur
  static async register(req, res) {
    try {
      const { username, email, password, confirmpassword } = req.body;

      if (!username || !email || !password || !confirmpassword) {
        return res.status(400).json({
          success: false,
          message: "Veuillez remplir tous les champs",
        });
      }
      if (password !== confirmpassword) {
        return res.status(400).json({
          success: false,
          message: "Les mots de passe ne correspondent pas",
        });
      }
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Ce nom d'utilisateur est déjà pris",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const password_hash = bcrypt.hashSync(password, salt);
      const user = await User.create({ username, email, password_hash });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("accessToken", accessToken, this.#cookieConfig);
      res.cookie("refreshToken", refreshToken, this.#cookieConfig);

      res.status(201).json({
        success: true,
        message: "Compte créé avec succès",
        userId: user.id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création du compte",
      });
    }
  }

  // Login - Connexion d'un utilisateur
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Veuillez remplir tous les champs",
        });
      }

      const user = await User.findByUsername(username);

      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({
          success: false,
          message: "Identifiants incorrects",
        });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("accessToken", accessToken, this.#cookieConfig);
      res.cookie("refreshToken", refreshToken, this.#cookieConfig);
      req.session.user = user;

      res.status(200).json({
        success: true,
        message: "Connexion réussie", // Added missing comma here
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          admin: user.admin,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la connexion",
      });
    }
  }

  // Logout - Déconnexion d'un utilisateur
  static async logout(req, res) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      req.session.destroy((err) => {
        if (err) throw new Error("Erreur session");
        res.redirect("/");
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la déconnexion",
      });
    }
  }

  // Show - Affichage d'un profil utilisateur
  static async show(req, res) {
    try {
      const profile = await User.show(req.params.id);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      res.render("pages/profile", {
        title: `Profil de ${profile.username}`,
        cssFile: "profile.css",
        user: req.user || null,
        profile: profile,
        isOwnProfile: false,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du profil",
      });
    }
  }

  // Reach - Recherche d'utilisateurs
  static async reach(req, res) {
    try {
      const { username } = req.query;
      const users = await User.searchByUsername(username);

      res.status(200).json({
        success: true,
        users: users || [],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la recherche",
      });
    }
  }

  // Destroy - Suppression d'un compte utilisateur
  static async destroy(req, res) {
    try {
      const userId = req.params.id;
      const result = await User.delete(userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      res.status(200).json({
        success: true,
        message: "Compte supprimé avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du compte",
      });
    }
  }
}

module.exports = UserController;
