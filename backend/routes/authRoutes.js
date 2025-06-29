const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/validation.js');

const Router = express.Router();

Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/logout', authenticateJWT, logout);

module.exports = Router;