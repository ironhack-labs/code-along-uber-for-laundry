
const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

authRoutes.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/auth/signup", (req, res, next) => {
  const {name, email, password} = req.body;


  if (name === "" || email === "" || password === "") {
    req.flash('error', "Indicate username and password");
    res.redirect("/auth/signup");
    return;
  }

  User.findOne({name:name}, (err, user) => {
    if (user) {
      req.flash('error', "The username already exists");
      res.redirect("/auth/signup");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        req.flash('error', "Something went wrong");
        res.redirect("/auth/signup");
      } else {
        res.redirect("/");
      }
    });
  });
});

module.exports = authRoutes;
