const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let user = req.user;
  if(req.user){
    res.render('index', {user});
  }else {
    res.render('index');
  }
});

module.exports = router;
