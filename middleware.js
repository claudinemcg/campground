//const isLoggedIn = (req, res, next) => {
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to create a new campground');
        return res.redirect('/login');
    }
    next();
    // next runs if the user is logged in
}