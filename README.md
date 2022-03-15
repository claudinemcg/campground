# YelpCamp
<br>A website where users can view campgrounds with the option to register/login to create or edit their own campgrounds and leave reviews on others.
Built with Node.js, Express, HTML, CSS, JavaScript, MongoDB and Mapbox.


## View Online

[https://fathomless-tundra-46520.herokuapp.com/](https://fathomless-tundra-46520.herokuapp.com/)

## Features

* Authentication:-
  * Users can sign up/ login with username and password
  * Users need to be logged in to submit a campground or review

* Authorization:-

  * Users need to be logged in to add or edit their campgrounds/ reviews
  * Users cannot leave reviews on their own campground
  * Users can only edit or delete their own campgrounds/ reviews

* Basic Functionality:-
  * Add name, images and description to the campground
  * Create, update and delete a campground
  * Create and delete a review
  * Flash messages to warn or greet the users
  * Responsive web design
  * Display campground location using Mapbox
  * Search and read exising campgrounds and reviews
 
## Getting Started

### Clone or download this repository

```sh
git clone https://github.com/claudinemcg/campground.git
```

### Install dependencies

```sh
npm install
```

or

```sh
yarn install
```

## Built with

### Front-end

* [ejs](http://ejs.co/)
* [Mapbox](https://www.mapbox.com/)
* [Bootstrap](https://getbootstrap.com/docs/3.3/)

### Back-end

* [express](https://expressjs.com/)
* [mongoDB](https://www.mongodb.com/)
* [mongoose](http://mongoosejs.com/)
* [async](http://caolan.github.io/async/)
* [crypto](https://nodejs.org/api/crypto.html#crypto_crypto)
* [helmet](https://helmetjs.github.io/)
* [passport](http://www.passportjs.org/)
* [passport-local](https://github.com/jaredhanson/passport-local#passport-local)
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [moment](https://momentjs.com/)
* [cloudinary](https://cloudinary.com/)
* [geocoder](https://github.com/wyattdanger/geocoder#geocoder)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)

### Platforms

* [Cloudinary](https://cloudinary.com/)
* [Heroku](https://www.heroku.com/)
* [Cloud9](https://aws.amazon.com/cloud9/?origin=c9io)
## License

#### [MIT](./LICENSE)
