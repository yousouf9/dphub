const express = require('express');
const router = express.Router();

/* GET Skill Profiling  page. */
router.get('/whatwedo/skill_profile',  async function(req, res, next) {
   
    res.render('whatwedo/skil', { 
        title: 'WhatWeDo'
      });
});


/* GET talent Profiling  page. */
router.get('/whatwedo/talent_profile',  async function(req, res, next) {
   
    res.render('whatwedo/talent', { 
        title: 'WhatWeDo'
      });
});

/* GET DP complain   page. */
router.get('/whatwedo/dp_complain',  async function(req, res, next) {
   
    res.render('whatwedo/dp_complain', { 
        title: 'WhatWeDo'
      });
});

/* GET talent Profiling  page. */
router.get('/whatwedo/displace_monitor',  async function(req, res, next) {
   
    res.render('whatwedo/displace', { 
        title: 'WhatWeDo'
      });
});

/* GET Who we are page. */
router.get('/getinvoled/intern',  async function(req, res, next) {
   
    res.render('getinvolved/internshipform.pug', { 
        title: 'GetInvolved'
      });
});

module.exports = router;