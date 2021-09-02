// run this on its own when we want to seed or ressed
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; // set to db so its shorter to write
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
})
const sample = array => array[Math.floor(Math.random() * array.length)];
// one line functions don't need {}
// selecting a random element from array

const seedDB = async () => { // seedDB returns a promise because it's an async function
    await Campground.deleteMany({}); // delete every campground in database
    // const c = new Campground({ title: 'Purple Field' });
    // await c.save();
    for (let i = 0; i < 30; i++) { // creates 30 new campgrounds
        const random55 = Math.floor(Math.random() * 55); // 55- cities in array in cities.js
        const price = Math.floor(Math.random() * 20) + 10; // random price
        const camp = new Campground({
            // my author id
            author: '612f9854d24c9261ef4d2f76',
            // '6116631106371f5ad4bba995', // development
            location: `${cities[random55].city}, ${cities[random55].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            // random images
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            price, // shorthand for price: price
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random55].longitude,
                    cities[random55].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/di6k1pdz4/image/upload/v1629730234/YelpCamp/mzgk7hr7nmfbcwlqm4hc.jpg',
                    filename: 'YelpCamp/mzgk7hr7nmfbcwlqm4hc'
                },
                {
                    url: 'https://res.cloudinary.com/di6k1pdz4/image/upload/v1629730235/YelpCamp/twsdh0hoye2cskosf2lg.jpg',
                    filename: 'YelpCamp/twsdh0hoye2cskosf2lg'
                }
            ]
        })
        await camp.save();
        // console.log(camp);
    }
}
// run seedDB and then close it when it's finished
seedDB().then(() => {
    mongoose.connection.close();
})

