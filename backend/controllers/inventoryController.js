
const Product = require("../models/Product");

// Get All Products Inventory
const getInventory = async (req, res) => {
    try {
        const products = await Product.find()
            .select("name price stock category isAvailable");

        res.status(200).json({
            success: true,
            totalProducts: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get inventory",
            error: error.message
        });
    }
};

// Get Low Stock Products
const getLowStockProducts = async (req, res) => {
    try {
        const threshold = 5;

        const products = await Product.find({
            stock: { $lte: threshold }
        }).select("name price stock category isAvailable");

        res.status(200).json({
            success: true,
            lowStockThreshold: threshold,
            totalLowStockProducts: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get low stock products",
            error: error.message
        });
    }
};

// Update Product Stock
const updateProductStock = async (req, res) => {
    try {
        const { stock } = req.body;

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative whole number"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product stock updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product stock",
            error: error.message
        });
    }
};

module.exports = {
    getInventory,
    getLowStockProducts,
    updateProductStock
};
