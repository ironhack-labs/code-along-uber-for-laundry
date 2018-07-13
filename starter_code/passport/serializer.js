
const passport = require('passport');
const User = require('../models/user');

passport.serializeUser((user, callback) => {
    callback(null, user._id);
})

passport.deserializeUser((id, callback) => {
    User.findById(id)
    .then(user => {
        callback(null, user);
    })
    .catch(err => {
        callback(null, false);
    })
})