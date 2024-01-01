const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

router.post(`/register`, async (req, res) => {
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

router.post(`/login`, async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.JWT_SECRET
    
    if (!user) {
        return res.status(400).send('User not found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.password)){
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '1d'
            }
        )

        return res.status(200).send({user: user.email, token: token})
    } else {
        return res.status(400).send('Incorrect Email or Password')
    }   
})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();
    
    if (!userCount) {
        res.status(500).json({success: false})
    } 

    res.send({
        userCount: userCount
    });
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({success: true, message: 'User deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'User not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    });
})

module.exports = router;