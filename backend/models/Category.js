const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

exports.Category = mongoose.model('Category', categorySchema);