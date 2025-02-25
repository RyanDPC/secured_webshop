const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticateToken } = require("../middlewares/auth");

// Middleware to check admin rights
const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.admin !== 1) {
    return res.status(403).json({
      success: false,
      message: "Accès réservé aux administrateurs"
    });
  }
  next();
};

// Admin-only routes
router.get("/users", [authenticateToken, checkAdmin], UserController.reach);
router.get("/profile/:id", [authenticateToken, checkAdmin], UserController.show);
router.get("/users/:username", [authenticateToken, checkAdmin], UserController.reach);

module.exports = router;