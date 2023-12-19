const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');

router.get(`/`, async (req, res) => {
    const products = await Product.find()
    
    if (!products) {
        res.status(500).json({success: false})
    } 

    res.send(products);
})

router.post(`/`, (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });

    newProduct.save().then((createdProduct => {
        res.status(201).json(createdProduct);
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

module.exports = router;