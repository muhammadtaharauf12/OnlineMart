
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        // Get token from request header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login first."
            });
        }

        // Remove Bearer from token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find logged-in user
        const user = await User.findById(decoded.id).select("-password");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User not found or account inactive"
            });
        }

        // Save user information in request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;
