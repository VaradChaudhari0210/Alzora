const { configDotenv } = require('dotenv');
const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');

const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/auth',authRoutes);

app.listen(PORT,(req,res) => {
    console.log(`server running on port:http://localhost:${PORT}`);
})