
const admin = (req, res, next) => {
    // Check user role
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }
};

module.exports = admin;
