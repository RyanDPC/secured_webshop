// Initialement créé le 19 février 2021
const express = require("express");
const router = express.Router();
const { authenticateToken, checkToken } = require("../middlewares/auth");

const checkAdmin = (req, res, next) => {
  if (req.user.admin !== 1) {
    return res.redirect("/profile");
  }
  next();
}
// Helper pour le rendu des vues
const renderView = (res, template, options = {}) => {
  res.render(template, {
    layout: "components/layout",
    ...options
  });
};

// Routes publiques
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
    cssFile: "form.css",
  });
});

// Routes protégées
router.get("/profile", authenticateToken, (req, res) => {
  renderView(res, "pages/profile", {
    title: "Mon Profil",
    cssFile: "profile.css",
    user: req.user || null,     // Pour le header (utilisateur connecté)
    profile: req.user || null,  // Pour le contenu du profil
    isOwnProfile: true         // Pour indiquer que c'est notre propre profil
  });
});

router.get("/admin", [authenticateToken, checkAdmin], (req, res) => {
  renderView(res, "pages/admin", {
    title: "Administration",
    cssFile: "admin.css",
    user: req.user || null,
  });
});

module.exports = router;