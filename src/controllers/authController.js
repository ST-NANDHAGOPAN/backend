const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {AdminRegisterModel , UserRegisterModel} = require("../models/authModel");

exports.verifyToken = (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Token is valid
        res.status(200).json({ valid: true, decoded });
    });
};

exports.adminLogin = async (req, res) => {
    const { email } = req.body;
    try {
        const admin = await AdminRegisterModel.findOne({ email });
        // Generate JWT token
        const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};

exports.adminRegister = async (req, res) => {
    const { email, password, password_confirmation } = req.body;
    try {
        if (password !== password_confirmation) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const existingAdmin = await AdminRegisterModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'An admin with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password

        // Create a new admin user
        const newAdmin = new AdminRegisterModel({
            email,
            password: hashedPassword 
        });
        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign({ email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};

exports.userLogin = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserRegisterModel.findOne({ email });
        // Generate JWT token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};


exports.userRegister = async (req, res) => {
    const { email, password, password_confirmation } = req.body;
    try {
        if (password !== password_confirmation) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const existingUser = await UserRegisterModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'An user with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password

        // Create a new admin user
        const newUser = new UserRegisterModel({
            email,
            password: hashedPassword 
        });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};