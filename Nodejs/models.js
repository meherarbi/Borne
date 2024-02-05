const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const restaurantSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,  // Consider hashing before storing
    linkBackOffice: String,
    databaseName: String,
    startLicenseDate: Date,
    endLicenseDate: Date,
    periodOfLicense: Number,
    License :String
});

const adminSchema = new mongoose.Schema({
    username: String,
    password: String, // Store as hash
    fullname: String,
    email: String,
    lastConnected: Date,
    agent: String,
    ip: String
});

adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Restaurant, Admin };
