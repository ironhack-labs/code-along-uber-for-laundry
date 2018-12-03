const express = require('express');
const laundryRouter = express.Router();
const User = require('../models/user');
const {isLoggedIn} = require('../middlewares/isLogged');


laundryRouter.get('/dashboard', isLoggedIn('/auth/login'), (req, res, next) => {
  res.render('laundry/dashboard');
});

laundryRouter.post('/launderers', (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {$set: {"fee": req.body.fee, "isLaunderer": true}}, {new: true}).then(() => {
    res.redirect('/laundry/dashboard');
  });
});

laundryRouter.get('/launderers', isLoggedIn('/auth/login'), (req, res, next) => {
  User.find({isLaunderer: true}, (err, launderersList) => {
    if (err) {
      next(err);
      return;
    }
    res.render('laundry/launderers', {launderers: launderersList});
  });
});


module.exports = laundryRouter;
