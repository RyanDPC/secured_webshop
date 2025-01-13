const express = require('express');

const router = express.Router();
const controller = require("../controllers/UserController");
router.post('/register', controller.create); 
router.post('/login', controller.login);
router.post('/delete', controller.delete);
router.post('/modify', controller.modify);
module.exports = router; 