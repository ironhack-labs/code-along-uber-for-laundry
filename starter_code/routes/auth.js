const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
    res.render('auth/signup', {
      errorMessage: ''
    });
  });
  
  router.post('/signup', (req, res, next) => {
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;
  
    if (emailInput === '' || passwordInput === '') {
      res.render('auth/signup', {
        errorMessage: 'Enter both email and password to sign up.'
      });
      return;
    }
  
    User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
      if (err) {
        next(err);
        return;
      }
  
      if (existingUser !== null) {
        res.render('auth/signup', {
          errorMessage: `The email ${emailInput} is already in use.`
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(passwordInput, salt);
  
      const userSubmission = {
        name: nameInput,
        email: emailInput,
        password: hashedPass
      };
  
      const theUser = new User(userSubmission);
  
      theUser.save((err) => {
        if (err) {
          res.render('auth/signup', {
            errorMessage: 'Something went wrong. Try again later.'
          });
          return;
        }
  
        res.redirect('/');
      });
    });
  });


  // LOGIN
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  router.post("/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    if (email === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "email": email })
    // did something went wrong? Then throw an error
      .catch(err => {
        throw err
      })
      // if everthing with the find-method went right
      .then(user => {
        // if I can't find that user:
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist"
          })
          return
        }
        // if I found a user, I compare the passwords and if that's true
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          // I found the user, but the password isn't correct
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      })
    });
  
    // LOGOUT
    router.get('/logout', (req, res, next) => {
        if (!req.session.currentUser) {
          res.redirect('/');
          return;
        }
        req.session.destroy((err) => {
          if (err) {
            next(err);
            return;}
          res.redirect('/');
        });
      });

module.exports = router;