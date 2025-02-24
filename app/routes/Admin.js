// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/UserController");
const { authenticateToken } = require("../middlewares/auth");

// Route pour montrer tous les users (doit être en premier)
router.get("/users", authenticateToken, AdminController.showAllUsers);

// Route pour voir un user spécifique
router.get("/users/:id", authenticateToken, AdminController.getUsersProfile);

// Route pour rechercher un user
router.get("/:id", authenticateToken, AdminController.rechercheUser);

module.exports = router;
