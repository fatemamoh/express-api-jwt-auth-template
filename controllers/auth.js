const express = require('express');

const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/sign-up', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userInDatabase = await User.findOne({ username });

        if (userInDatabase) {
            return res.status(409).json({ err: 'Invalid username or password' });
        }

        const hashPassword = bcrypt.hashSync(password, 10);
        req.body.password = hashPassword;

        const user = await User.create(req.body);

        const payload = {
            username: user.username,
            _id: user._id
        };

        const token = jwt.sign({ payload }, process.env.JWT_SECRET);

        res.status(201).json({ token });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;