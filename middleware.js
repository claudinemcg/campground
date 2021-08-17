const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
// destructure schemas because we'll use a few of the schemas in that file
const ExpressError = require('./utils/ExpressError');
// const { reviewSchema} = require('../schemas.js');

//const isLoggedIn = (req, res, next) => {
module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER", req.user);
    // req.user put there by passport
    if (!req.isAuthenticated()) {
        // store url they are requesting
        // console.log(req.path, req.originalUrl);
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
    // next runs if the user is logged in
}

module.exports.validateCampground = (req, res, next) => {
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

module.exports.isAuthor = async (req, res, next) => {
    // async because we need to await Campground.findById(id)
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// for routes/reviews.js
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    // async because we need to await Campground.findById(id)
    const { id, reviewId } = req.params; // campground params
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}