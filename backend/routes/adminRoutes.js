const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Admin Dashboard - Admin Only
router.get("/dashboard", protect, admin, getDashboardStats);

// All Orders - Admin Only
router.get("/orders", protect, admin, getAllOrders);

// Update Order Status - Admin Only
router.patch("/orders/:id/status", protect, admin, updateOrderStatus);

module.exports = router;