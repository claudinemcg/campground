const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
// destructure schemas because we'll use a few of the schemas in that file

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
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
    // validateCampground runds first
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // throw error, catchAsync will hand it off to next which throws it down to app.us at the bottom


    const campground = new Campground(req.body.campground);
    // need app.use(express.urlencoded({extended: true})); from above to parse req.body
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground); // check if populating works
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // spread req.body.campground into id object
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
module.exports = router;