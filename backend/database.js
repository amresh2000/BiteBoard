const mongoose = require('mongoose');

// Connection URI. Replace "BiteBoardDB" with your database name.
const mongoURI = 'mongodb://localhost/BiteBoardDB';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true, // Only if you're using MongoDB versions that support collection indexing.
});

const db = mongoose.connection;

// Error handler for MongoDB connection
db.on('error', console.error.bind(console, 'connection error:'));

// Confirmation once the connection is open
db.once('open', function () {
    console.log('Connected successfully to MongoDB');
});

// Optional: Export the database connection to be used elsewhere in the application
module.exports = db;

