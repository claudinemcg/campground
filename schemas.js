const Joi = require('joi');
// const campgroundSchema = Joi.object({
module.exports.campgroundSchema = Joi.object({
    // this is not a mongoose schema- this is going to validate our data before it goes to mongoose
    campground: Joi.object({
        // campground is our key e.g. in form name= Campground[price]
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});


