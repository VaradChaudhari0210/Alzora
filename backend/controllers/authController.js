const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Controller
exports.signup = async (req, res) => {
    const { email, password, fullName, role } = req.body;
    try {
        const existing = await prisma.User.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.User.create({
            data: { email, passwordHash, fullName, role }
        });
        res.json({ message: "Signup successful", user: { id: user.id, email: user.email } });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.User.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Incorrect email" });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "15d" }
        );
        res.status(200).json({
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error) {
        console.log("Error logging in:", error);
        res.status(500).json({ message: `Error logging in ${error}` });
    }
};

// Logout Controller (with DB blacklisting)
exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        await prisma.BlacklistedToken.create({ data: { token } });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error blacklisting token" });
    }
};