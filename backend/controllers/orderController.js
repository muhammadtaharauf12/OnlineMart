const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Address = require("../models/Address");

// Place New Order
const placeOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod } = req.body;

        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Please select a delivery address"
            });
        }

        if (paymentMethod && !["COD", "Mock Payment"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        // Find customer's cart
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // Find customer's delivery address
        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Delivery address not found"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Check products and calculate total
        for (const item of cart.items) {
            const product = item.product;

            if (!product || !product.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is unavailable"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}`
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        // Create order
      const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode
    },
    totalAmount,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending"
});

        // Reduce product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear customer's cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Customer Orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Order
const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Cancel Order

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check current order status
        const currentStatus = String(order.orderStatus || "")
            .trim()
            .toLowerCase();

        // Only Pending and Confirmed orders can be cancelled
        if (!["pending", "confirmed"].includes(currentStatus)) {
            return res.status(400).json({
                success: false,
                message: "This order cannot be cancelled or is already cancelled"
            });
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        // Update order status
        order.orderStatus = "Cancelled";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
    


module.exports = {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder
};