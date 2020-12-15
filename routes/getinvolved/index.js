const express = require('express');
const router = express.Router();

/* GET getInvolved page. */
router.get('/getinvolved',  async function(req, res, next) {
   
    res.render('getinvolved/home.pug', { 
        title: 'GetInvolved'
      });
});

/* GET Who we are page. */
router.get('/getinvoled/intern',  async function(req, res, next) {
   
    res.render('getinvolved/internshipform.pug', { 
        title: 'GetInvolved'
      });
});

module.exports = router;