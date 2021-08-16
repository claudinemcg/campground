const mongoose = require('mongoose');
const Schema = mongoose.Schema // shorter to write
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // User model
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' // Review model
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // findOneAndDelete is a query middleware
    // it only works because in app.js we have :
    // app.delete..
    //     await Campground.***findByIdAndDelete***(id); 
    //     ...
    // console.log(doc);
    if (doc) { // this doc has reviews ...
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
                // ... and we are going to remove the reviews that match
                //  the id(s) in the doc we just deleted
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);