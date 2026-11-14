const express = require("express");

const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

// All order routes require customer login

router.post("/", protect, placeOrder);

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getSingleOrder);

router.patch("/:id/cancel", protect, cancelOrder);

module.exports = router;