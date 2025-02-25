const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticateToken } = require("../middlewares/auth");

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected routes
router.post("/logout", authenticateToken, UserController.logout);
router.get("/profile/:id", authenticateToken, UserController.show);
router.get("/search", authenticateToken, UserController.reach);
router.delete("/:id", authenticateToken, UserController.destroy);

module.exports = router;