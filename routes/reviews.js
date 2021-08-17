const express = require('express');
const router = express.Router({ mergeParams: true });

// const Campground = require('../models/campground');
// const Review = require('../models/review');

const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// const { reviewSchema } = require('../schemas.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;