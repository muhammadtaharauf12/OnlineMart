
const Product = require("../models/Product");

// 1. Add New Product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock,
            unit
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
            unit
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add product"
        });
    }
};


// 2. Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            totalProducts: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get products"
        });
    }
};


// 3. Get Single Product
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get product"
        });
    }
};


// 4. Update Product

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.log("UPDATE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};



// 5. Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};
