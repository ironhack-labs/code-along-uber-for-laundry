const passport = require("passport");
require('./serializers');
require('./strategies/local');

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
