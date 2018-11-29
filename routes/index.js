var express = require('express');
var router = express.Router();

const passport = require('passport');
require('../config/passport')(passport);
/* GET home page. */
router.get('/', function(req, res, next) {
  let auth = req.isAuthenticated();
  console.log(auth);
  res.render('index', {
    auth: auth,
    loginMessage: req.flash('loginMessage')
  });

});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}));

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {
    user: req.user
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
module.exports = router;

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
