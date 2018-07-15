const express = require('express');
const router = express.Router();
const User = require("../models/User");
const LaundryPickup= require("../models/Laundry-pickup")


router.get('/dashboard', (req, res, next) => {
  res.render('laundry/dashboard');
});
router.post("/dashboard",(req,res,next)=>{
 console.log(req.session.passport)
 console.log(req.session.passport.user)
 User.findByIdAndUpdate(req.session.passport.user,
  {isLaunderer: true, fee:req.body.fee}
  )
  .then(() => {
    console.log("ok")
    res.redirect("/")
  })
  .catch(console.log("Not OK"))

})

router.get('/launderers', (req, res, next) => {
  User.find({ isLaunderer: true }, (err, launderersList) => {
    if (err) {
      next(err);
      return;
    }
    console.log(launderersList)
    res.render('laundry/launderers', {
      launderers: launderersList
    });
  });
});

router.get('/launderers/:id', (req, res, next) => {
  const laundererId = req.params.id;
  console.log(laundererId)
  User.findById(laundererId, (err, theUser) => {
    if (err) {
      next(err);
      return;4
    }

    res.render('laundry/launderer-profile', {
      theLaunderer: theUser
    });
  });
});


router.post('/laundry-profile', (req, res, next) => {
  console.log(req.session)
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.passport.user
  };

  const thePickup = new LaundryPickup(pickupInfo);

  thePickup.save()
  .then(res.redirect('/laundry/dashboard'))
    
});



module.exports = router;