const express = require('express');
const router  = express.Router();

const User = require('../models/user');
const LaundryPickup = require('../models/laundry-pickup');

const isLoggedIn = (req, res, next) => {
    if(req.user) next();
    else res.redirect('/login');
}

router.get('/dashboard', isLoggedIn, (req, res, next) => {
    let query;
    if(req.user.isLaunderer) query = {launderer: req.user._id}
    else query = {user: req.user._id}

    LaundryPickup.find(query)
    .populate('user', 'name').populate('launderer', 'name')
    .sort('pickupDate')
    .lean()
    .then(pickups => {
        for(pickup of pickups) {
            pickup.pickupDate = pickup.pickupDate.toLocaleDateString();
        }

        res.render('laundry/dashboard', {pickups});
    })
})

router.post('/launderers', (req, res, next) => {
    const userId = req.user._id;

    const laundererInfo = {
        fee: req.body.fee,
        isLaunderer: true
    };

    User.findByIdAndUpdate(userId, laundererInfo)
    .then(user => {
        res.render('laundry/dashboard')
    })
    .catch(err => next())
})

router.get('/launderers', isLoggedIn, (req, res, next) => {
    User.find({isLaunderer: true, _id: {$ne: req.user._id}})
    .then(launderers => {
        res.render('laundry/launderers', {launderers});
    })
})

router.get('/launderers/:id', isLoggedIn, (req, res, next) => {
    const laundererId = req.params.id;

    User.findById(laundererId)
    .then(user => {
        res.render('laundry/launderer-profile', {theLaunderer: user});
    })
})

router.post('/laundry-pickups', isLoggedIn, (req, res, next) => {
    const {pickupDate, laundererId} = req.body;
    const userId = req.user._id;

    const newPickUp = new LaundryPickup({
        pickupDate,
        user: userId,
        launderer: laundererId,         
    })

    newPickUp.save()
    .then(() => {
        res.redirect('/dashboard');
    })

})

module.exports = router;