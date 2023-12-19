const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');

router.get(`/`, async (req, res) => {
    const categories = await Category.find();

    if (!categories) {
        res.status(500).json({success: false});
    }

    res.send(categories);
})

module.exports = router;