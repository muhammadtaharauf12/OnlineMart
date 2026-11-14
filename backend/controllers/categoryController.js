
const Category = require("../models/Category");

// 1. Create Category (Admin)
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            description,
            image
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create category"
        });
    }
};


// 2. Get All Categories (Public)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isActive: true
        });

        res.status(200).json({
            success: true,
            totalCategories: categories.length,
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get categories"
        });
    }
};


// 3. Get Single Category (Public)
const getSingleCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get category"
        });
    }
};


// 4. Update Category (Admin)
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update category"
        });
    }
};


// 5. Delete Category (Admin)
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
};
                                                                                                