// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post('/signup', (req, res, next) => {
  const {name, email, password} = req.body;

  if (email === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    });
    return;
  }

  User.findOne({ email })
    .then (user => {
      if (user) {
        throw new Error ( `The email ${email} is already in use.`);
        res.render('auth/login');
      }
      else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashedPass = bcrypt.hashSync(password, salt);

        const userSubmission = {
          name: name,
          email: email,
          password: hashedPass
        };

        const theUser = new User(userSubmission);

        theUser.save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
      }
    })
    .catch (e => {
      return res.render('auth/login', {errorMessage: e.message});
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

router.post('/login', (req, res, next) => {
  const {email, password} = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email })
    .then (user => {
      if (!user) throw new Error(`There isn't an account with email ${email}.`);
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      }
      else{
        throw new Error ('Invalid password.');
      }
    })
    .catch (e =>{
      return res.render('auth/login', {errorMessage: e.message});
    });
});

router.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/');
  });
});

module.exports = router;
