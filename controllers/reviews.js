const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // in form name = "review[x]""
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    // save campground as well because we are saving a ref to reviews in campground
    req.flash('success', 'New review created!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    // need to remove review and ref to review in campground
    const { id, reviewId } = req.params; //req.params.id and req.params.reviewId
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // when deleteing reviews, delete the reviews in the campground, too
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}