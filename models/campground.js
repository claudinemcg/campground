const mongoose = require('mongoose');
const Schema = mongoose.Schema // shorter to write
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    // virtual property from mongoose
    return this.url.replace('/upload', '/upload/w_200');
    // this refers to image
    // create a thmubnail by putting w_200 (width 200) in the url as cloudinary 
    // requests for its transformations
    // ie its a modified version of an already existing image
});

const opts = { toJSON: { virtuals: true } };
// mongoose virtuals arn't automatically included when converted to JSOn so need to set this here
// need it for CampgroundSchema.virtual('properties.popUpMarkup')... below

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: { // from mongoose docs (changed name location to geometry)
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    // virtual property from mongoose
    // need properties when formatting mapbox popup
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p> ${this.description.substring(0, 20)} ...</p> `
    // this refers to the particular campground instance
});

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