const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateToken } = require('./userRoutes');

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    const post = new Post({
        ...req.body,
        author: req.user.userId // Assuming JWT token contains userId
    });
    try {
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author');
        res.send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Protected routes below require the authenticateToken middleware

// Get a post by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a post
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate({ _id: req.params.id, author: req.user.userId }, req.body, { new: true, runValidators: true });
        if (!post) {
            return res.status(404).send('Post not found or user not authorized');
        }
        res.send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.userId });
        if (!post) {
            return res.status(404).send('Post not found or user not authorized');
        }
        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all posts by userID in descending order
router.get('/user/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
        if (!posts) {
            return res.status(404).send('Post not found or user not authorized');
        }
        res.send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Like and unlike a post by ID
router.patch('/like/:id', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const hasLiked = post.likedBy.includes(userId);
        const update = hasLiked
            ? { $pull: { likedBy: userId }, $inc: { likes: -1 } }
            : { $addToSet: { likedBy: userId }, $inc: { likes: 1 } };

        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });
        res.status(200).send(updatedPost);
    } catch (error) {
        res.status(500).send({ message: 'Error updating post likes', error: error.message });
    }
});


module.exports = router;
