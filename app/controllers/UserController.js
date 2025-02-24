const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/auth");
const User = require("../models/User"); // Corrected import statement

class UserController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Veuillez remplir tous les champs",
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

      const user = await User.create({
        username,
        email,
        password_hash,
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        success: true,
        message: "Compte créé avec succès",
        userId: user.id,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la création du compte",
      });
    }
  }

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

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Identifiants introuvables ou incorrects",
        });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Mot de passe incorrects",
        });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.status(200).json({
        success: true,
        message: "Connexion réussie",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la connexion",
      });
    }
  }
  static async logout(req, res) {
    try {
      console.log("Logging out user:", req.user);

      // Clear the token from cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res
            .status(500)
            .json({ message: "Erreur lors de la déconnexion" });
        }

        // Redirect to home page after successful logout
        res.redirect("/");
      });
    } catch (error) {
      console.error("Error logging out user:", error);
      res.status(500).json({
        message: "Erreur lors de la déconnexion",
        error,
      });
    }
  }
  static async rechercheUser(req, res) {
    try {
      const { username } = req.params;
      console.log("Searching for user with username:", username);

      const user = await User.show(username);

      if (!user) {
        console.log("User not found:", username);
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      console.log("User found:", user);

      res.status(200).json({
        message: "Utilisateur trouvé",
        user,
      });
    } catch (error) {
      console.error("Error searching for user:", error);
      res.status(500).json({
        message: "Erreur lors de la recherche de l'utilisateur",
        error,
      });
    }
  }
  static async showAllUsers(req, res) {
    try {
      const users = await User.showall();
      if (!users) {
        return res.status(404).json({
          success: false,
          message: "Aucun utilisateur trouvé",
        });
      }
      res.status(200).json({
        success: true,
        users: users,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs",
        error: error.message,
      });
    }
  }
  static async getUsersProfile(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.show(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur:", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de l'utilisateur",
        error: err.message,
      });
    }
  }
}

module.exports = UserController;
