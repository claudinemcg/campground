// run this on its own when we want to seed or ressed
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

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
const sample = array => array[Math.floor(Math.random() * array.length)];
// one line functions don't need {}
// selecting a random element from array


const seedDB = async () => { // seedDB returns a promise because it's an async function
    await Campground.deleteMany({}); // delete every campground in database
    // const c = new Campground({ title: 'Purple Field' });
    // await c.save();
    for (let i = 0; i < 50; i++) { // creates 50 new campgrounds
        const random1000 = Math.floor(Math.random() * 1000); // 100- cities in array in cities.js
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

// run seedDB and then close it when it's finished
seedDB().then(() => {
    mongoose.connection.close();
})

