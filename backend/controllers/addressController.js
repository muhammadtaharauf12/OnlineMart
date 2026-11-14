const Address = require("../models/Address");

// Add New Address
const addAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine,
            city,
            province,
            postalCode,
            label,
            isDefault
        } = req.body;

        if (!fullName || !phone || !addressLine || !city || !province) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required address details"
            });
        }

        // If this is the first address, make it default
        const addressCount = await Address.countDocuments({
            user: req.user._id
        });

        const address = await Address.create({
            user: req.user._id,
            fullName,
            phone,
            addressLine,
            city,
            province,
            postalCode,
            label,
            isDefault: addressCount === 0 ? true : isDefault
        });

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Customer Addresses
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            addresses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Address
const getSingleAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Address
const updateAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Address
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Set Default Address
const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Remove default status from all customer addresses
        await Address.updateMany(
            { user: req.user._id },
            { isDefault: false }
        );

        // Make selected address default
        address.isDefault = true;
        await address.save();

        res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addAddress,
    getAddresses,
    getSingleAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};