var express = require('express');
var authRoutes = express.Router();


authRoutes.get('/', function(req, res, next) {
  res.render('index');
});



module.exports = authRoutes;
