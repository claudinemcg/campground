const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    // need app.use(express.urlencoded({extended: true})) to parse req.body
    campground.author = req.user.id;
    // assign loggedIn user to the author of the campground
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
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
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // spread req.body.campground into id object
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}