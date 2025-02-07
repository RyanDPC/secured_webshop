const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/auth");
const User = require("../models/User"); // Corrected import statement

class UserController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      console.log("Registering user with data:", { username, email });

      const salt = bcrypt.genSaltSync(10);
      const password_hash = bcrypt.hashSync(password, salt);

      const user = await User.create({
        username,
        email,
        password_hash,
        salt,
        admin: false,
        profile_pic: "",
        created_at: new Date(),
        updated_at: new Date(),
      });

      console.log("User registered successfully:", user);

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        userId: user.id,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error,
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log("Logging in user with username:", username);

      const user = await User.findByUsername(username);

      if (!user) {
        console.log("User not found:", username);
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);

      if (!isMatch) {
        console.log("Incorrect password for user:", username);
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      console.log("User logged in successfully:", username);

      // Set the token in cookies with an expiration time of 1 hour
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.status(200).json({
        message: "Connexion réussie",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({
        message: "Erreur lors de la connexion",
        error,
      });
    }
  }
static async logout(req, res) {
    try {
        console.log("Logging out user:", req.user);

        // Clear the token from cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Erreur lors de la déconnexion" });
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

      const user = await User.findByUsername(username);

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
}

module.exports = UserController;
