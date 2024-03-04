const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true }, // URL to the image of the post
    caption: { type: String, default: '' }, // Caption for the post
    likes: { type: Number, default: 0 }, // Number of likes
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the post
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
}, { timestamps: true }); // Adding timestamps for created and updated times

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
