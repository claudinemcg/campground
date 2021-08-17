const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');
// const { campgroundSchema } = require('../schemas.js');
// don't need above as we moved middleware that uses it to middleware.js file
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index));

// new needs to go before show or else it treats /new as /id
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
//if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
// throw error, catchAsync will hand it off to next which throws it down to app.us at the bottom


router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
module.exports = router;