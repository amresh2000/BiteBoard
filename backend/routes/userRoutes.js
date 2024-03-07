const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Hash passswords
const jwt = require('jsonwebtoken'); // JWT for handling user authentication

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.sendStatus(401); // No token found

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token is no longer valid
        req.user = user;
        next();
    });
};


// Create a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update a user
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a user
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();
        res.status(201).send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

// User login with email and password
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('User not found with email:', req.body.email);
            return res.status(400).send({ message: "Email or password is wrong" });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            console.log('Invalid password for user:', req.body.email);
            return res.status(400).send({ message: "Email or password is wrong" });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );
        res.status(200).send({ token, userId: user._id.toString() });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).send(error);
    }
});

// Get user profile
router.get('/profile/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const { username, bio, profileImageUrl } = user;
        res.send({ username, bio, profileImageUrl });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update user profile
router.patch('/profile/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const authenticatedUserId = req.user.userId;

        // Check if the authenticated user is the same as the user being updated
        if (userId !== authenticatedUserId) {
            return res.status(403).send({ message: "Unauthorized access" });
        }

        const { bio, profileImageUrl } = req.body;

        // Update the user's bio and profileImageUrl
        const updatedUser = await User.findByIdAndUpdate(userId, { bio, profileImageUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send(updatedUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router; // Default export of the router
module.exports.authenticateToken = authenticateToken; // Named export of the authenticateToken


