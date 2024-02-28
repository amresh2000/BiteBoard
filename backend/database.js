const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/BiteBoardDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected successfully to MongoDB');
});

// User Schema for the 'users' collection
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Post Schema for the 'posts' collection
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Post = mongoose.model('Post', postSchema);

// Export both models
module.exports = { User, Post };



