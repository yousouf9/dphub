const express = require('express');
const router = express.Router();

/* GET getInvolved page. */
router.get('/getinvolved',  async function(req, res, next) {
   
    res.render('getinvolved/home', { 
        title: 'GetInvolved'
      });
});

/* GET WgetInvolved Intern page. */
router.get('/getinvoled/intern',  async function(req, res, next) {
   
    res.render('getinvolved/internshipform', { 
        title: 'GetInvolved'
      });
});


/* GET getInvolved promoter page. */
router.get('/getinvoled/promoter',  async function(req, res, next) {
   
  res.render('getinvolved/promoter', { 
      title: 'GetInvolved'
    });
});

module.exports = router;