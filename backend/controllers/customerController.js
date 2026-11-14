
const User = require("../models/User");

// Get All Customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "customer" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalCustomers: customers.length,
            customers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get customers",
            error: error.message
        });
    }
};

// Get Single Customer
const getSingleCustomer = async (req, res) => {
    try {
        const customer = await User.findOne({
            _id: req.params.id,
            role: "customer"
        }).select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get customer",
            error: error.message
        });
    }
};

// Update Customer Account Status
const updateCustomerStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const customer = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "customer"
            },
            { isActive },
            { new: true, runValidators: true }
        ).select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer status updated successfully",
            customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update customer status",
            error: error.message
        });
    }
};

module.exports = {
    getAllCustomers,
    getSingleCustomer,
    updateCustomerStatus
};
