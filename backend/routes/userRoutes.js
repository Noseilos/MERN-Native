const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');

router.get(`/`, async (req, res) => {
    const users = await User.find().select('-password');

    if (!users) {
        res.status(500).json({success: false})
    }

    res.send(users);
})

router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(500).json({success: false, message: 'User not found!'});
    }

    res.send(user);

})

router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
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