const express = require('express');
const { signup, login, logout, savePatientDetails, patientSignup } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/validation.js');

const Router = express.Router();

Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/logout', authenticateJWT, logout);
Router.post('/patient-details', authenticateJWT, savePatientDetails);
Router.post('/patient-signup', patientSignup);

module.exports = Router;