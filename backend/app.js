const { configDotenv } = require('dotenv');
const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const memoryRoutes = require('./routes/memoryRoutes');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/auth',authRoutes);
app.use('/memory',memoryRoutes);

app.listen(PORT,(req,res) => {
    console.log(`server running on port:http://localhost:${PORT}`);
})