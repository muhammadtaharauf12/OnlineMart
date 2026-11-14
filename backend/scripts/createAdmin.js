
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const adminExists = await User.findOne({
            email: "admin@onlinemart.com"
        });

        if (adminExists) {
            console.log("Admin account already exists!");
            return;
        }

        const admin = await User.create({
            firstName: "OnlineMart",
            lastName: "Admin",
            email: "admin@onlinemart.com",
            password: "Admin12345",
            role: "admin"
        });

        console.log("Admin account created successfully!");
        console.log("Email:", admin.email);

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
