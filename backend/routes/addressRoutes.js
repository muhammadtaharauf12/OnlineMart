const express = require("express");

const router = express.Router();

const {
    addAddress,
    getAddresses,
    getSingleAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require("../controllers/addressController");

const protect = require("../middleware/authMiddleware");

// All address routes require customer login

router.post("/", protect, addAddress);

router.get("/", protect, getAddresses);

router.get("/:id", protect, getSingleAddress);

router.put("/:id", protect, updateAddress);

router.delete("/:id", protect, deleteAddress);

router.patch("/:id/default", protect, setDefaultAddress);

module.exports = router;