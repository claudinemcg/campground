const mongoose = require('mongoose');
const Schema = mongoose.Schema // shorter to write 

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // User model
    }
});

module.exports = mongoose.model('Review', reviewSchema);
//  connect review with campground
// this is a 1 to many relationship ie 1 campground has many reviews
// store object ids in capground schema 