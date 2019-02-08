// routes/laundry.js
const express = require('express');

const User = require('../models/user');

const router = express.Router();

const LaundryPickup = require('../models/laundry-pickup');

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});

router.get('/dashboard', (req, res, next) => {
  let query;

  if (req.session.currentUser.isLaunderer) {
    query = { launderer: req.session.currentUser._id };
  } else {
    query = { user: req.session.currentUser._id };
  }

  LaundryPickup
    .find(query)
    .populate('user', 'name')
    .populate('launderer', 'name')
    .sort('pickupDate')
    .exec((err, pickupDocs) => {
      if (err) {
        next(err);
        return;
      }

      res.render('laundry/dashboard', {
        pickups: pickupDocs
      });
    });
});

router.get('/launderers', (req, res, next) => {
  User.find({ isLaunderer: true }, (err, launderersList) => {
    if (err) {
      next(err);
      return;
    }

    res.render('laundry/launderers', {
      launderers: launderersList
    });
  });
});

router.post('/launderers', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  };
  console.log('Hellloooo');
  User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }
    console.log(theUser);
    req.session.currentUser = theUser;

    res.redirect('/dashboard');
  });
});

router.get('/launderers/:id', (req, res, next) => {
  const laundererId = req.params.id;

  User.findById(laundererId, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    res.render('laundry/launderer-profile', {
      theLaunderer: theUser
    });
  });
});

router.post('/laundry-pickups', (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.currentUser._id
  };
  console.log('Username', pickupInfo.user);

  const thePickup = new LaundryPickup(pickupInfo);
  console.log(thePickup);
  thePickup.save((err) => {
    console.log('YOOOOO');
    if (err) {
      next(err);
      return;
    }

    res.redirect('/dashboard');
  });
});

module.exports = router;
