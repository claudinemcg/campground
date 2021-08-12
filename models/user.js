const mongoose = require('mongoose');
const Schema = mongoose.Schema // shorter to write
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true // not a validation
    }
})
UserSchema.plugin(passportLocalMongoose);
// passport will add on username, password, make sure username is unique, other features

// compile model
module.exports = mongoose.model('User', UserSchema)