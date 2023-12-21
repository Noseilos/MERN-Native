const express = require('express');
require('dotenv/config');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.options('*', cors());


// Route Imports
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

const api = process.env.API_URL

// Routes
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Database Connected ... ')
    })
    .catch((err)=>{
        console.log(err)
    })

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})