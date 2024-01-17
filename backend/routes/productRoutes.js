const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { Category } = require('../models/Category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type')

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function(req, file, cb){
        const fileName = file.originalname.replace(' ', '-')
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
})

const uploadOptions = multer({storage: storage});

router.get(`/`, async (req, res) => {
    
    let filter = {};
    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }
    
    const products = await Product.find(filter).populate('category');
    
    if (!products) {
        res.status(500).json({success: false})
    } 

    res.send(products);
})

router.post(`/`, uploadOptions.single('image'),async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send(`Invalid Category`);
    }

    const file = req.file;
    if (!file) {
        return res.status(400).send(`Image Required`);
    }
    const fileName = req.file.filename;
    const baseUrl = `${req.protocol}://${req.get('host')}/public/upload/`

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        longDescription: req.body.longDescription,
        image: `${baseUrl}${fileName}`,
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

router.put(`/:id`, uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send(`Invalid Product Id`);
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send(`Invalid Category`);
    }

    const productCheck = await Product.findById(req.params.id);
    if (!productCheck) {
        return res.status(400).send(`Invalid Product`)
    }

    const file = req.file;
    let imagePath;

    if (file) {
        const fileName = req.file.filename;
        const baseUrl = `${req.protocol}://${req.get('host')}/public/upload/`;
        imagePath = `${baseUrl}${fileName}`;
    } else {
        imagePath = product.image;
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

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({success: true, message: 'Product deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    });
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();
    
    if (!productCount) {
        res.status(500).json({success: false})
    } 

    res.send({
        productCount: productCount
    });
})

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const featuredProducts = await Product.find({isFeatured: true}).limit(+count);
    
    if (!featuredProducts) {
        res.status(500).json({success: false})
    } 

    res.send({
        featuredProducts: featuredProducts
    });
})

module.exports = router;