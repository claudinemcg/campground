const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
// destructure schemas because we'll use a few of the schemas in that file
const { isLoggedIn } = require('../middleware')

const validateCampground = (req, res, next) => {
    // const result = campgroundSchema.validate(req.body);
    // don't need all result- take error from it (below)
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        // need map over error.details and turn into a string as it's an array and need to turn into a string
        // to be able to pass it into ExpressError below
        throw new ExpressError(msg, 400)
        // result.error.details -  found using console.log(result)
        // it's an array
    } else {
        next();
        //  need to call next if we want make it into the route handle app.post below 
    }
    // console.log(result)
}

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

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        // if user didn't find campground with an id e.g. campground deleted
        req.flash('error', 'Cannot Find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // spread req.body.campground into id object
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));
module.exports = router;