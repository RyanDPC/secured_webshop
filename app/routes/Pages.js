const express = require("express");
const router = express.Router();
const { authenticateToken, checkToken } = require("../middlewares/auth");

// Helper for view rendering
const renderView = (res, template, options = {}) => {
  res.render(template, {
    layout: "components/layout",
    ...options
  });
};

// Public routes
router.get("/", checkToken, (req, res) => {
  renderView(res, "pages/home", {
    title: "Accueil",
    cssFile: "home.css",
    user: req.user || null
  });
});

router.get("/login", (req, res) => {
  renderView(res, "pages/login", {
    title: "Se connecter",
    cssFile: "form.css",
    error: req.query.error || null
  });
});

router.get("/register", (req, res) => {
  renderView(res, "pages/register", {
    title: "Créer un compte",
    cssFile: "form.css"
  });
});

// Protected routes
router.get("/profile", authenticateToken, (req, res) => {
  renderView(res, "pages/profile", {
    title: "Mon Profil",
    cssFile: "profile.css",
    user: req.user || null,
    profile: req.user || null,
    isOwnProfile: true
  });
});

router.get("/admin", authenticateToken, (req, res) => {
  renderView(res, "pages/admin", {
    title: "Administration",
    cssFile: "admin.css",
    user: req.user || null
  });
});

module.exports = router;