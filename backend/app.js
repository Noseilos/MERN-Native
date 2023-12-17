const express = require('express');
require('dotenv/config');
const app = express();
const morgan = require('morgan');


app.use(express.json());
app.use(morgan('tiny'));

const api = process.env.API_URL

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'Android 14',
        image: 'some_url'
    }
    res.send(product);
})

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    res.send(newProduct);
})

app.listen(3000, () => {
    console.log()
    console.log('Server is running on http://localhost:3000');
})