const express = require('express');
const laundryRouter = express.Router();
const User = require('../models/user');


laundryRouter.get('/dashboard', (req, res, next) => {
  res.render('laundry/dashboard');
});

laundryRouter.post('/launderers', (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {$set: {"fee": req.body.fee, "isLaunderer": true}}, {new: true}).then(() => {
    res.redirect('/laundry/dashboard');
  });
//   req.user.fee = req.body.fee;
//   req.user.isLaunderer = true;
//   req.user.save().then(()=>{
//     res.redirect('/laundry/dashboard');
//   });
});


module.exports = laundryRouter;
