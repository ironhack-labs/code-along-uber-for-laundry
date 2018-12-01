const isLoggedIn = redirectTo => (req,res,next) => {
  if(req.user) return next();
  req.flash('error','You have no access!');
  req.session.returnTo = req.url;
  res.redirect(redirectTo);
}

const isLoggedOut = redirectTo => (req,res,next) => {
  if(!req.user) return next();
  req.flash('error','You are logged in already!');
  delete req.session.returnTo;
  res.redirect(redirectTo);
}

module.exports = {
  isLoggedIn,
  isLoggedOut
}
