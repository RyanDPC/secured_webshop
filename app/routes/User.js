const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');

// Route pour l'inscription
router.post('/signup', controller.create);

// Route pour la connexion
router.post('/login', controller.login);

module.exports = router;
