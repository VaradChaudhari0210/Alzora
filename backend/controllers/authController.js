const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Controller
exports.signup = async (req, res) => {
    const { email, password, fullName, role, phone } = req.body;
    try {
        const existing = await prisma.User.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.User.create({
            data: { email, passwordHash, fullName, role, Phone: phone }
        });
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "15d" }
        );
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                phone: user.Phone
            }
        });
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

exports.savePatientDetails = async (req, res) => {
    const userId = req.user.id;
    const {
        nickname,
        DateOfBirth,
        Address,
        Phone,
        Interests,
        caregiverName,
        caregiverPhone,
        caregiverEmail
    } = req.body;

    try {
        await prisma.User.update({
            where: { id: userId },
            data: {
                nickname,
                DateOfBirth,
                Address,
                Phone,
                Interests: Interests ? Interests.split(',').map(i => i.trim()) : [],
            }
        });

        // Optionally, save caregiver info to a Caregiver table or as a note
        // Example: create a CaregiverNote or a new Caregiver model

        res.json({ message: "Patient details saved successfully" });
    } catch (error) {
        console.error("Error saving patient details:", error);
        res.status(500).json({ message: "Error saving patient details" });
    }
};

exports.patientSignup = async (req, res) => {
    const {
        fullName,
        email,
        password,
        role,
        phone,
        nickname,
        DateOfBirth,
        Address,
        Interests,
        caregiver
    } = req.body;

    try {
        // Check if user already exists
        const existing = await prisma.User.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }
        const interestsArray = Array.isArray(Interests)
            ? Interests
            : typeof Interests === 'string'
                ? Interests.split(',').map(i => i.trim()).filter(Boolean)
                : [];

        // Hash password
        const passwordHash = await require('bcrypt').hash(password, 10);

        // Create user
        const user = await prisma.User.create({
            data: {
                fullName,
                email,
                passwordHash,
                role,
                Phone: phone,
                nickname,
                DateOfBirth,
                Address,
                Interests: interestsArray,
            }
        });

        // Optionally, save caregiver info (example: as a CaregiverNote)
        // if (caregiver && caregiver.name) {
        //     await prisma.CaregiverNote.create({
        //         data: {
        //             caregiverId: user.id,
        //             note: `Caregiver: ${caregiver.name}, Phone: ${caregiver.phone}, Email: ${caregiver.email}`,
        //             uploadId: null // or handle as needed
        //         }
        //     });
        // }

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                phone: user.Phone,
                nickname: user.nickname,
                DateOfBirth: user.DateOfBirth,
                Address: user.Address,
                Interests: user.Interests
            }
        });
    } catch (error) {
        console.error("Error in patient signup:", error);
        res.status(500).json({ message: "Error creating patient account" });
    }
};