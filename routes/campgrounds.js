const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');
// const { campgroundSchema } = require('../schemas.js');
// don't need above as we moved middleware that uses it to middleware.js file
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// new needs to go before show or else it treats /new as /id
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // validateCampground runds first
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // throw error, catchAsync will hand it off to next which throws it down to app.us at the bottom
    const campground = new Campground(req.body.campground);
    // need app.use(express.urlencoded({extended: true})); from above to parse req.body
    campground.author = req.user.id;
    // assign loggedIn user to the author of the campground
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground); // check if populating works
    if (!campground) {
        // if user didn't find campground with an id e.g. campground deleted
        req.flash('error', 'Cannot Find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        // if user didn't find campground with an id e.g. campground deleted
        req.flash('error', 'Cannot Find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // spread req.body.campground into id object
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));
module.exports = router;