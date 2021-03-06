const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // features is an array
    const campground = new Campground(req.body.campground); // need app.use(express.urlencoded({extended: true})) to parse req.body
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // map over array in req.files and get the path value for our url key
    // and filename value for our filename key
    // e.g 
    // [{
    //      fieldname: 'image',
    //      originalname: 'tent.jpeg',
    //      encoding: '7bit',
    //      mimetype: 'image/jpeg',
    //   ***path: 'https://res.cloudinary.com/di6k1pdz4/image/upload/v1629724579/YelpCamp/ohv4sbb6ognug61vgzk1.jpg'***,
    //      size: 260601,
    //   ***filename: 'YelpCamp/ohv4sbb6ognug61vgzk1'****
    // ]}
    campground.author = req.user.id; // assign loggedIn user to the author of the campground
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => { // show
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // review author
        }
    }).populate('author'); // campground author
    // console.log(campground); // check if populating works
    if (!campground) {
        // if user didn't find campground with an id e.g. campground deleted
        req.flash('error', 'Cannot Find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => { // show
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        // if user didn't find campground with an id e.g. campground deleted
        req.flash('error', 'Cannot Find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); // spread req.body.campground into id object
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // take images out of the image folder if they have the same filename as the ones in the deleteImages array
        console.log(campground);
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}