const express = require('express');
const {Header} = require('../../model/General/header');
const router = express.Router();
const multer = require('multer');
const upload_ = multer({dest : 'public/images/uploads/general'});
const upload_team = multer({dest : 'public/images/uploads/team'});



/* GET Resource press page. */
router.get('/resource/press',  async function(req, res, next) {
       
    const header = await Header.find()
   
    if(!header) return res.status(404).send("NO Header image");

    res.render('resource/press', { 
        title: 'Resources',
        header
      });
});



/* Administrator section */
/* GET Administrator Resourcepage. */
router.get('/administrator/resources',  function(req, res, next) {

    res.render('admin/resource', { 
        title: 'Resource'
      });
});


module.exports = router