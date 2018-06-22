const express = require('express');
const router = express.Router();
// include the user model
const User = require('../models/user')
const LaundryPickup = require('../models/laundry-pickup');


router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
        return;
    }
    res.redirect('/login');
})

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
})

router.post('/launderers', (req, res, next) => {
    const userId = req.session.currentUser._id;
    const feeInput = req.body.fee;

    User.findByIdAndUpdate(userId, { isLaunderer: true, fee: feeInput }, { new: true }, (err, user) => {
        if (err) {
            next(err);
            return;
        }
        req.session.currentUser = user;
        res.redirect('/dashboard');
    });
});

router.get('/launderers/:id', (req, res, next) => {
    const laundererId = req.params.id;
    User.findById(laundererId, (err, user) => {
        if (err) {
            next(err);
            return;
        }
        res.render('laundry/launderer-profile', {
            theLaunderer: user
        });
    });
});

router.post('/laundry-pickups', (req, res, next) => {
    const pickupInfo = {
        pickupDate: req.body.pickupDate,
        launderer: req.body.laundererId,
        user: req.session.currentUser._id
    };

    const thePickup = new LaundryPickup(pickupInfo);
    thePickup.save((err) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect('/dashboard');
    });
});

module.exports = router;