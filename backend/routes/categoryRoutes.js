
const express = require("express");

const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Create Category - Admin Only
router.post("/", protect, admin, createCategory);

// Get All Categories - Public
router.get("/", getAllCategories);

// Get Single Category - Public
router.get("/:id", getSingleCategory);

// Update Category - Admin Only
router.put("/:id", protect, admin, updateCategory);

// Delete Category - Admin Only
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
