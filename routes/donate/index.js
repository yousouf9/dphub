const express = require('express');
const fs = require('fs')
const path = require('path');
const {Pagination}= require('../../middleware/pagination');
const authenticate= require('../../middleware/athenticate');
const admin= require('../../middleware/admin');
const router = express.Router();



/* GET CONTACT US page. */
router.get('/donate',  async function(req, res, next) {
       

    res.render('donation/donate', { 
        title: 'Donate',
      });
});



//Administrator section

router.get('/administrator/donation',  authenticate, admin,  async function(req, res, next) {
       

  res.render('admin/donation', { 
      title: 'Donations',
      user:req.currentUser

    });
});

module.exports = router