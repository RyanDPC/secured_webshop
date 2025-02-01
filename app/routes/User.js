// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Route pour créer un utilisateur
router.post("/register", UserController.create);

// Route pour se connecter
router.post("/login", UserController.login);

// Route pour éditer un utilisateur
router.put("/:id", UserController.edit);

// Route pour supprimer un utilisateur
router.delete("/:id", UserController.deleteUser);

// Route pour afficher un utilisateur
router.get("/:id", UserController.show);

// Route pour rechercher des utilisateurs par nom
router.get("/search", UserController.search);

module.exports = router;
