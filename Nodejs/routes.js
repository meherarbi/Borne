const express = require('express');
const router = express.Router();
const { Restaurant, Admin } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup route for Admin
// router.post('/signup', async (req, res) => {
//     try {
//         const adminData = {
//             ...req.body,
//             lastConnected: new Date(),  // Set current timestamp
//             agent: req.get('User-Agent'),  // Or set from req.body if required
//             ip: req.ip                      // Or set from req.body if required
//         };
//         const admin = new Admin(adminData);
//         await admin.save();
//         res.status(201).send(admin);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });
function verifyToken(req, res, next) {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authorizationHeader.substring(7); // Remove 'Bearer ' from the beginning

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ error: 'Unauthorized: Invalid or expired token' });
        }

        // If token is valid, you can access decoded data (e.g., username: decoded.username)

        next(); // Proceed to the next middleware or route
    });
}

// Login route for Admin
router.post('/login', async (req, res) => {
    console.log("heloo this is login")

    try {
    console.log("heloo this is 2")

        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin || !await bcrypt.compare(req.body.password, admin.password)) {
            return res.status(401).send({ error: 'Login failed!' });
        }

        // Get the user's IP address from the request
        const agentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // If the username and password are correct, create a JWT token
        const token = jwt.sign(
            { username: admin.username, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires after 1 hour
        );
        
        // You can customize the payload as per your requirements

        // Send the agent IP and token in the response as an array
        res.send({ data: [agentIp, token] });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Add a new Restaurant
router.post('/restaurant',verifyToken, async (req, res) => {
    const restaurant = new Restaurant(req.body);
    try {
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Endpoint to get all restaurants
router.get('/restaurants', verifyToken, async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).send(error);
    }
});
// Endpoint to update a restaurant by ID
router.put('/restaurant/:id', verifyToken, async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }  // This option returns the modified document
        );

        if (!updatedRestaurant) {
            return res.status(404).send('Restaurant not found');
        }

        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a Restaurant
router.delete('/restaurant/:id',verifyToken,async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }
        res.send(restaurant);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
