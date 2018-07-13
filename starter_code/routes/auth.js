const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

const passport = require('passport');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    const {name, email, password} = req.body;

    if(name == "" || email == "" || password == "") {
        res.render('/signup', {errorMessage: "Some information is missing!"});
    }

    User.findOne({name})
    .then(user => {
        if(user) res.render('/signup', {errorMessage: "User already exist!"});
        return;
    })

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
        name,
        password: hashPass,
        email
    })

    newUser.save()
    .then(user => {
        res.redirect('/login');
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;