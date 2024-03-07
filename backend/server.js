require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(express.json()); // for parsing application/json

mongoose.connect('mongodb://localhost/BiteBoardDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected successfully to MongoDB');
    console.log(process.env.JWT_SECRET);
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
