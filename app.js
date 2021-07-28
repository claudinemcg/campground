const express = require('express');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
// destructure schemas because we'll use a few of the schemas in that file
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; // set to db so its shorter to write
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
})

app.engine('ejs', ejsMate); // use ejsMate, not the default
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // parse req.body
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    // const result = campgroundSchema.validate(req.body);
    // don't need all result- take error from it (below)
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        // need map over error.details and turn into a string as it's an array and need to turn into a string
        // to be able to pass it into ExpressError below
        throw new ExpressError(msg, 400)
        // result.error.details -  found using console.log(result)
        // it's an array
    } else {
        next();
        //  need to call next if we want make it into the route handle app.post below 
    }
    // console.log(result)
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    // res.send('Hello!')
    res.render('home'); // home.ejs
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// new needs to go before show or else it treats /new as /id
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // validateCampground runds first
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // throw error, catchAsync will hand it off to next which throws it down to app.us at the bottom


    const campground = new Campground(req.body.campground);
    // need app.use(express.urlencoded({extended: true})); from above to parse req.body
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => { // show
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) // spread req.body.campground into id object
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // in form name = "review[x]""
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

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