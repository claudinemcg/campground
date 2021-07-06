const mongoose = require('mongoose');
const Schema = mongoose.Schema // shorter to write

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    location: String,
    description: String
})

module.exports = mongoose.model('Campground', CampgroundSchema);