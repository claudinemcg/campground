const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    // use try catch to use own error catch and redirect
    try {
        const { email, username, password } = req.body;
        // destructure email, username, password from req.body
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); // hash and salt password
        // console.log(registeredUser);
        req.login(registeredUser, err => {  // passport- logins registered user
            // can't use await above as it's not supported in passport
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
        //res.send(req.body);
        // not logged in, just registered
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    // passport.authenticate() is a middleware from passport
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // if they had to log in, after login in return to the page they tried to
    // access before login, if  req.session.returnTo send them to /campgrounds
    delete req.session.returnTo; // don't want to store this in the session
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/campgrounds');
}