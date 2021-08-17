const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
// const ExpressError = require('../utils/ExpressError');
// const { userSchema } = require('../schemas.js');

router.route('/register')
    .get(users.renderRegister) //get register form
    .post(catchAsync(users.register)) // register user

router.route('/login')
    .get(users.renderLogin) // get login form
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), users.login)
// login user

router.get('/logout', users.logout) //logout

module.exports = router;

// old way
// router.get('/register', users.renderRegister);

// router.post('/register', catchAsync(users.register));

// router.get('/login', users.renderLogin);

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), users.login)

// router.get('/logout', users.logout)

// module.exports = router;