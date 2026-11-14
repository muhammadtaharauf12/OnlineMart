
const express = require("express");
const router = express.Router();

const {
    getAllCustomers,
    getSingleCustomer,
    updateCustomerStatus
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// All Customers - Admin Only
router.get("/", protect, admin, getAllCustomers);

// Single Customer - Admin Only
router.get("/:id", protect, admin, getSingleCustomer);

// Update Customer Status - Admin Only
router.patch("/:id/status", protect, admin, updateCustomerStatus);

module.exports = router;
