// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticateToken } = require("../middlewares/auth");

// Route pour créer un utilisateur
router.post("/register", UserController.register);

// Route pour se connecter
router.post("/login",UserController.login);

// // Route pour éditer un utilisateur
router.put("/:id", UserController.rechercheUser);

//Route pour se déconnecter
router.post("/logout", UserController.logout);

module.exports = router;
