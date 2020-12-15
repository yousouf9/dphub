var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/verify_email', function(req, res, next) {
  res.render('forgotpassword', { title: 'verify email' });
});

router.get('/change_password', function(req, res, next) {
  res.render('resetPassword', { title: 'reset' });
});

module.exports = router;
