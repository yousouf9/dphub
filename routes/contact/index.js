const express = require('express');
const router = express.Router();
const multer = require('multer');


/* GET CONTACT US page. */
router.get('/contact',  async function(req, res, next) {
       

    res.render('contact', { 
        title: 'Contact',
      });
});

module.exports = router