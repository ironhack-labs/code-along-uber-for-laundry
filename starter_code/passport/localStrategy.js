
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

passport.use(new LocalStrategy({usernameField: 'email'}, (username, password, next) => {
    User.findOne({email: username})
    .then(user => {
        if(!user) return next(null, false, {message: 'Incorrect username'});
        if(!bcrypt.compareSync(password, user.password)) return next(null, false, {message: 'Incorrect Password'});

        return next(null, user);
    })
    .catch(err => {
        return next(err);
    })
}))