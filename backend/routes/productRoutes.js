
const express = require("express");

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Add Product - Admin Only
router.post("/", protect, admin, createProduct);

// Get All Products - Public
router.get("/", getAllProducts);

// Get Single Product - Public
router.get("/:id", getSingleProduct);

// Update Product - Admin Only
router.put("/:id", protect, admin, updateProduct);

// Delete Product - Admin Only
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
