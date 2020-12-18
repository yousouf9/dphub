const express = require('express');
const router = express.Router();



/* GET CONTACT US page. */
router.get('/donate',  async function(req, res, next) {
       

    res.render('donation/donate', { 
        title: 'Donate',
      });
});

module.exports = router