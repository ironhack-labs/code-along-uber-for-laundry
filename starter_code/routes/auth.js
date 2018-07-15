const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const flash = require("connect-flash")


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log("entro")
  const { username,email, password } = req.body;

  let validateForm = new Promise((resolve, reject) => {
    if (username === "") return reject(new Error("Username must be filled"));
    else if (password === "")
      return reject(new Error("Password must be filled"));
    resolve();
  });

  validateForm
    .then(() => {
      return User.findOne({ email });
    })
    .then(user => {
      if (user) {
        throw new Error("Username already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      res.render("auth/signup", { errorMessage: err.message });
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post( "/login", passport.authenticate("local", {
   successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: false,
    passReqToCallback: true
  }),
);



router.get("/logout", (req, res,) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
