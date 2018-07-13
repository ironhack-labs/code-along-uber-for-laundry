const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {errorMessage: ""});
});


router.get('/login', (req, res, next) => {
  res.render('auth/login', {'message': req.flash('error')});
});

module.exports = router;
