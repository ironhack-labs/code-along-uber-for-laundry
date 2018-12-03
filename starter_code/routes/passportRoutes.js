const express = require('express');
const passportRouter = express.Router();
const passport = require('passport');



passportRouter.get("/auth/login", (req, res, next) => {
  res.render("auth/login");
});

passportRouter.post("/auth/login", passport.authenticate("local", {
  failureRedirect: "/auth/login",
  badRequestMessage: "Indicate mail and password",
  failureFlash: true,
  passReqToCallback: true
}),(req,res) => {
  // if(req.session.returnTo){
  //   return res.redirect(req.session.returnTo);
  // }
  res.redirect('/');
});

passportRouter.get('/logout',(req,res) => {
  req.logout();
  res.redirect('/')
})

module.exports = passportRouter;
