const express = require('express');
const User=require("../models/User")
const LaundryPickup=require("../models/laundry-pickup")

const router = express.Router();
const {
  ensureLoggedIn,
  ensureLoggedOut,
  isLaunderer
} = require("../middlewares/ensureLogin");


router.get('/dashboard', ensureLoggedIn("/auth/login") ,(req, res, next) => {
  let query;

  if (req.user.isLaunderer) {
    query = { launderer: req.user.id };
  } else {
    query = { user: req.user.id };
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


router.post('/launderers', ensureLoggedIn("/auth/login"), (req, res, next) => {
  const userId = req.user.id;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  };

  User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/dashboard');
  });
});

router.get('/launderers', (req, res, next) => {
  console.log(req.user.id)
  User.find({ $and:[{isLaunderer: true },{_id:{$ne:req.user.id}}]}, (err, launderersList) => {
    if (err) {
      next(err);
      return;
    }
    res.render('laundry/launderers', {
      launderers: launderersList
    });
  });
});

router.get('/launderers/:id',ensureLoggedIn("/auth/login") ,(req, res, next) => {
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


router.post('/laundry-pickups',ensureLoggedIn("/auth/login"), (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.user.id
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