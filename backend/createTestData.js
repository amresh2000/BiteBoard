// Import mongoose and models
const mongoose = require('mongoose');
const { User, Post } = require('./database');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/BiteBoardDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected successfully to MongoDB');
});

async function createTestData() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create a new User
        const user = new User({
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
        });

        const savedUser = await user.save();
        console.log('User saved successfully');

        // Create new Posts and link to the User
        const post1 = new Post({
            title: 'First Post',
            content: 'This is the content for the first post by John Doe',
            author: savedUser._id, // Reference the saved User's ID
        });

        const post2 = new Post({
            title: 'Second Post',
            content: 'This is the content for the second post by John Doe',
            author: savedUser._id, // Reference the saved User's ID
        });

        // Save the Posts
        await post1.save();
        console.log('Post 1 saved successfully');
        await post2.save();
        console.log('Post 2 saved successfully');

    } catch (error) {
        console.error('Error creating test data:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Execute the function to create test data
createTestData();
