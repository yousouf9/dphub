const express = require('express');
const {Header} = require('../../model/General/header');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest : 'public/images/uploads/general'});

/* GET Administrator home page. */
router.get('/administrator/general',  function(req, res, next) {

    res.render('admin/general', { 
        title: 'about'
      });
});

//Uploading Slider information
router.post('/administrator/upload/header', upload.single('photo'), async(req,res)=>{

    let  mainImageName
      if(req.file){
          mainImageName                = req.file.filename;
      }else{
       console.log('Not uploading photo...');
       mainImageName = 'noimage.png';
      }

  //setting the name of the image
  req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/general/${mainImageName}`; 

  header = new Header(req.body);

  if(!header)  return res.status(400).send("failed to upload image");


      await header.save();
      req.flash('success', 'New Slider Image has been added');
      res.location('/administrator/general');
      res.redirect('/administrator/general');

})  

module.exports = router