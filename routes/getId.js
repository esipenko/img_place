var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (typeof req.user == 'undefined') res.redirect('/');
  else res.redirect('/users/' + req.user._id);
});

module.exports = router;
