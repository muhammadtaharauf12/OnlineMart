
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // Count total customers
        const totalCustomers = await User.countDocuments({
            role: "customer"
        });

        // Count total products
        const totalProducts = await Product.countDocuments();

        // Count total orders
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue from paid and delivered orders
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue = revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

        // Get latest 5 orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "firstName lastName email");

        res.status(200).json({
            success: true,
            dashboard: {
                totalCustomers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get dashboard statistics",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};
