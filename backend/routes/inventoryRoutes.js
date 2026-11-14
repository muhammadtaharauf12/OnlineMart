
const express = require("express");
const router = express.Router();

const {
    getInventory,
    getLowStockProducts,
    updateProductStock
} = require("../controllers/inventoryController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Get All Inventory - Admin Only
router.get("/", protect, admin, getInventory);

// Get Low Stock Products - Admin Only
router.get("/low-stock", protect, admin, getLowStockProducts);

// Update Product Stock - Admin Only
router.patch("/:id/stock", protect, admin, updateProductStock);

module.exports = router;
