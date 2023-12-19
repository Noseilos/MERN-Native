const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get(`/`, async (req, res) => {
    const orders = Order.find();

    if (!orders) {
        res.status(500).json({success: false})
    }

    res.send(orders);
})

module.exports = router;