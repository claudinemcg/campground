// const Joi = require('joi');
// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// destructure schemas because we'll use a few of the schemas in that file
// const catchAsync = require('./utils/catchAsync');
if (process.env.NODE_ENV !== 'production') {// ie if you're in development mode
    require('dotenv').config()
}

console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// const Campground = require('./models/campground');
// const Review = require('./models/review');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false // so don't get deprecation warning in the console
});

const db = mongoose.connection; // set to db so its shorter to write
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
})

const app = express();

app.engine('ejs', ejsMate); // use ejsMate, not the default
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true })); // parse req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const sessionConfig = {
    name: 'session', // don't want to use default name (security)
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // security
        // secure: true, // cookies can only be configered over a secure connection ie https 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires a week from date
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet()); // enables 11 middelware that helmet comes with

// what's allowed in helmet- configured
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];



const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/di6k1pdz4/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport-> use LocalStrategy (passport-local) and for that Local Strategy
// the authenciation is located on our user model called authenicate 
// (added in automatically by passport)
passport.serializeUser(User.serializeUser());
// how to store user in session
passport.deserializeUser(User.deserializeUser());
// get user out of that session



app.use((req, res, next) => {
    console.log(req.query);
    // access to these in every template
    // console.log(req.session);
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    } // added this in so when the user logins, it goes to the most recent
    // requested page after login
    res.locals.currentUser = req.user;
    // passport stores user id/email/username when logged in in req.user
    // undefined if not signed in
    res.locals.success = req.flash('success');
    // whatever is in the flash under success, take it and have access to it 
    // under locals under key success
    // use this middleware so we don't have to pass anything to our templates
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds', campgroundRoutes) // use the campground routes
app.use('/campgrounds/:id/reviews', reviewRoutes) // use the review routes
app.use('/', userRoutes) // use the user routes

app.get('/', (req, res) => {
    // res.send('Hello!')
    res.render('home'); // home.ejs
})


app.all('*', (req, res, next) => { // * all routes
    // res.send('404!!'); 
    next(new ExpressError('Page Not Found', 404)) // next will pass it to the function below app.use...
})

app.use((err, req, res, next) => {
    // res.send("Oh no, something went wrong!")
    //const { statusCode = 500, message = 'Something went wrong' } = err;
    // could have any error so take the stauus code and message from the error you're deaaling with- destructure it e.g. const { statusCode, message}
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    //res.status(statusCode).send(message);
    res.status(statusCode).render('error', { err });
    //error.ejs and pass err through to template so can use in response on error.ejs
}) // catchAsync sends here if there's something wrong

app.listen(3000, () => {
    console.log('Serving on port 3000');
})