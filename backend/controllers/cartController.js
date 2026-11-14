const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get Customer Cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Add Product to Cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID and quantity are required"
            });
        }

        const product = await Product.findById(productId);

        if (!product || !product.isAvailable) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unavailable"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available"
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            if (product.stock < existingItem.quantity + quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available"
                });
            }

            existingItem.quantity += quantity;

        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Cart Product Quantity
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        const product = await Product.findById(item.product);

        if (!product || !product.isAvailable) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unavailable"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available"
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Remove Product from Cart
const removeFromCart = async (req, res) => {
    try {
               
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        item.deleteOne();

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Clear Cart
const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};