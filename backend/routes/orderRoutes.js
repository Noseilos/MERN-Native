const express = require('express');
const router = express.Router();
const { Order } = require('../models/Order');
const { OrderItem } = require('../models/OrderItem');

router.get(`/`, async (req, res) => {
    const orders = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if (!orders) {
        res.status(500).json({success: false})
    }

    res.send(orders);
});

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });

    if (!order) {
        res.status(500).json({success: false})
    }

    res.send(order);
});

router.post(`/`, async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    }))
    const orderItemIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemIdsResolved.map(async orderItemId => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const total = orderItem.product.price * orderItem.quantity
        return total; 
    }))

    console.log(totalPrices)

    const totalSum = totalPrices.reduce((acc, price) => acc + price, 0);

    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalSum,
        user: req.body.user,
    })

    order = await order.save();

    if (!order){
        return res.status(404).send('Order was not created')
    }

    res.send(order);
});

router.put(`/:id`, async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        }, {
            new: true,
        }
    )

    if (!order) {
        res.status(500).json({success: false, message: 'Order not found!'});
    }

    res.send(order);
});

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async order => {
        if (order) {

            let orderedItemsDeleted = false;

            for (const orderItemId of order.orderItems){
                if (orderItemId) {
                    await OrderItem.findByIdAndDelete(orderItemId)
                    orderedItemsDeleted = true;
                } else {
                    return res.status(404).json({success: false, message: 'Order Items not found'})
                }
            }
            
            return res.status(200).json({success: true, message: 'Order deleted!'})

        } else {
            return res.status(404).json({success: false, message: 'Order not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err.message})
    });
});

router.get(`/get/totalsales`, async (req, res) => {

    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
        ]);

        if (totalSales.length === 0) {
            return res.status(400).send('Total sales cannot be generated');
        }

        res.send({ totalsales: totalSales[0].totalsales });
    } catch (error) {
        console.error('MongoDB Aggregation Error:', error);
        res.status(500).send('Internal Server Error');
    }
    
});

router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments();
    
    if (!orderCount) {
        res.status(500).json({success: false})
    } 

    res.send({
        orderCount: orderCount
    });
});

module.exports = router;