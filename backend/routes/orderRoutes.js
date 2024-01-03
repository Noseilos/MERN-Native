const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

router.get(`/`, async (req, res) => {
    const orders = Order.find();

    if (!orders) {
        res.status(500).json({success: false})
    }

    res.send(orders);
});

router.post(`/`, async (req, res) => {
    const orderItemsIds = req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    })

    let order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if (!order){
        return res.status(404).send('Order was not created')
    }

    res.send(order);
});

module.exports = router;