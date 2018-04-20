module.exports = function checkLaunderer() {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.launderer === true) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}