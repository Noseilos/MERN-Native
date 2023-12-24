const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { Category } = require('../models/Category');

router.get(`/`, async (req, res) => {
    const products = await Product.find().populate('category');
    
    if (!products) {
        res.status(500).json({success: false})
    } 

    res.send(products);
})

router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send(`Invalid Category`);
    }

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        longDescription: req.body.longDescription,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    const newProduct = await product.save();

    if (!newProduct) {
        return res.status(500).send(`Product can't be created`)
    }

    return res.send(newProduct);
})

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({success: false, message: 'Product not found!'});
    }

    res.send(product);

})

router.put(`/:id`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send(`Invalid Category`);
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            longDescription: req.body.longDescription,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        }, {
            new: true,
        }
    )

    if (!product) {
        res.status(500).json({success: false, message: 'Product not found!'});
    }

    res.send(product);
})

module.exports = router;