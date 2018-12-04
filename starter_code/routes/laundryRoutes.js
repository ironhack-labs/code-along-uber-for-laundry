const express = require('express');
const laundryRouter = express.Router();
const LaundryPickup = require('../models/laundry-pickup');
const User = require('../models/user');
const {isLoggedIn} = require('../middlewares/isLogged');


laundryRouter.get('/dashboard', isLoggedIn('/auth/login'), (req, res, next) => {
  let query;
  if (req.user.isLaunderer) {
    query = {launderer: req.user._id};
  } else {
    query = {user: req.user._id};
  }
  LaundryPickup
    .find(query)
    .populate('user', 'name')
    .populate('launderer', 'name')
    .sort('pickupDate')
    .exec((err, picks) => {
      const pickups = JSON.parse(JSON.stringify(picks));
      pickups.forEach((e,i)=>{
        let date =  new Date(e.pickupDate);
        e.pickupDate = date.toDateString();
      });
      if (err) {
        next(err);
        return;
      }
      res.render('laundry/dashboard', {pickups});
    });
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

laundryRouter.get('/launderers/:id', isLoggedIn('/auth/login'), (req, res, next) => {
  const laundererId = req.params.id;
  User.findById(req.params.id, (err, launderer) => {
    if (err) {
      next(err);
      return;
    }
    res.render('laundry/launderer-profile', {launderer});
  });
});

laundryRouter.post('/laundry-pickups', isLoggedIn('/auth/login'), (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.user._id
  };
  const thePickup = new LaundryPickup(pickupInfo);
  thePickup.save((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/laundry/dashboard');
  });
});



module.exports = laundryRouter;
