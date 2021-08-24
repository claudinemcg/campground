const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
// const { campgroundSchema } = require('../schemas.js');
// don't need above as we moved middleware that uses it to middleware.js file
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index)) // index page
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// expect multiple images under key 'image'
// can use upload.single for one
// console.log(req.body, req.files);
// create new campground
//if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
// throw error, catchAsync will hand it off to next which throws it down to app.us at the bottom

router.get('/new', isLoggedIn, campgrounds.renderNewForm)
// get new campground form
// new needs to go before show or else it treats /new as /id

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    // get campground show page
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // update the campground 
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
// delete campground

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
// get campground edit form

module.exports = router;

// old way
// router.get('/', catchAsync(campgrounds.index));

// router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// router.get('/:id', catchAsync(campgrounds.showCampground));

// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
