const express = require('express');
const multer = require('multer');
const { processMemoryUpload } = require('../controllers/memoryController');
const { authenticateJWT } = require('../middleware/validation.js');

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

Router.post('/upload', authenticateJWT, upload.single('file'), processMemoryUpload);

module.exports = Router;