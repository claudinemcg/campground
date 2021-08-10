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
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

app.engine('ejs', ejsMate); // use ejsMate, not the default
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // parse req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/campgrounds', campgrounds) // use the campgrounds route
app.use('/campgrounds/:id/reviews', reviews) // use the reviews route


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