const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.get(`/`, async (req, res) => {
    const users = await User.find();

    if (!users) {
        res.status(500).json({success: false})
    }

    res.send(users);
})

router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    user = await user.save();

    if (!user){
        return res.status(404).send('User was not created')
    }

    res.send(user);
});

module.exports = router;