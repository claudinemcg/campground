const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
// const ExpressError = require('../utils/ExpressError');
// const { userSchema } = require('../schemas.js');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    // use try catch to use own error catch and redirect
    try {
        const { email, username, password } = req.body;
        // destructure email, username, password from req.body
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); // hash and salt password
        console.log(registeredUser);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
        //res.send(req.body);
        // not logged in, just registered
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }



}));


module.exports = router;