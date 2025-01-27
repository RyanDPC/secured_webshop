const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const auth = require("../middlewares/auth");

// Route pour l'inscription
router.post("/signup", controller.create);

// Route pour la connexion
router.post("/login", controller.login);

router.get("/search", controller.searchUsers);

router.post("/logout", controller.logout);

router.get("/profile", auth.authenticateToken, controller.showProfile);

module.exports = router;
