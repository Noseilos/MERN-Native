const express = require('express');
require('dotenv/config');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');


app.use(express.json());
app.use(morgan('tiny'));

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Database Connected ... ')
    })
    .catch((err)=>{
        console.log(err)
    })

const api = process.env.API_URL

app.get(`${api}/products`, async (req, res) => {
    const product = await Product.find()
    
    if (!product) {
        res.status(500).json({success: false})
    } 

    res.send(product);
})

app.post(`${api}/products`, (req, res) => {
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

app.listen(3000, () => {
    console.log()
    console.log('Server is running on http://localhost:3000');
})