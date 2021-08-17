const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// const { reviewSchema } = require('../schemas.js');
const { validateReview } = require('../middleware');


router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // in form name = "review[x]""
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review created!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    // need to remove review and ref to review in campground
    const { id, reviewId } = req.params; //req.params.id and req.params.reviewId
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // when deleteing reviews, delete the reviews in the campground, too
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;