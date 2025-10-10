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

app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port: http://0.0.0.0:${PORT}`);
});