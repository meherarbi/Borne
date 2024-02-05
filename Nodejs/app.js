const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const app = express();
// Apply middleware
app.use(bodyParser.json());

// Import routes
const routes = require('./routes');

const port = 7050;

// Connect to MongoDB
mongoose.connect('mongodb+srv://adminkiosk:D5TtCLIzoQRtldR8@cluster0.xtpxwjq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
