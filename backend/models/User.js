const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' }, // Added bio field
    profileImageUrl: { type: String, default: '' }, // Added profile image URL field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
