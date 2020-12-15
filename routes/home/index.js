const express = require('express');
const {Slider} = require('../../model/home/slider');
const {Partner} = require('../../model/home/partner');
const {Story} = require('../../model/home/story');
const router = express.Router();
const multer = require('multer');
const upload_slider = multer({dest : 'public/images/uploads/slider'});
const upload_partner = multer({dest : 'public/images/uploads/partner'});
const upload_story = multer({dest : 'public/images/uploads/story'});

/* GET Administrator home page. */
router.get('/administrator',  function(req, res, next) {

      res.render('admin/home', { 
          title: 'home'
        });
});


router.get('/administrator/login', function(req, res, next) {
    res.render('admin/login', { title: 'Express' });
  });


//Uploading Slider information
router.post('/administrator/upload/slider', upload_slider.single('photo'), async(req,res)=>{

      let  mainImageName
        if(req.file){
            mainImageName                = req.file.filename;
        }else{
         console.log('Not uploading photo...');
         mainImageName = 'noimage.png';
        }

    //setting the name of the image
    req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/slider/${mainImageName}`; 

    slider = new Slider(req.body);

    if(!slider)  return res.status(400).send("failed to upload image");


        await slider.save();
        req.flash('success', 'New Slider Image has been added');
        res.location('/administrator');
        res.redirect('/administrator');

})  

//Uploading Partner information
router.post('/administrator/upload/partner', upload_partner.single('photo'), async(req,res)=>{

    let  mainImageName
    if(req.file){
        mainImageName                = req.file.filename;
    }else{
     console.log('Not uploading photo...');
     mainImageName = 'noimage.png';
    }

    //setting the name of the image
    req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/partner/${mainImageName}`; 

    partner = new Partner(req.body);

    if(!partner)  return res.status(400).send("failed to upload image");


        await partner.save();
        req.flash('success', 'New Partner detail has been added');
        res.location('/administrator');
        res.redirect('/administrator');

})

//Uploading Story information
router.post('/administrator/upload/story', upload_story.single('photo'), async(req,res)=>{
    let  mainImageName
    if(req.file){
        mainImageName                = req.file.filename;
    }else{
     console.log('Not uploading photo...');
     mainImageName = 'noimage.png';
    }

    //setting the name of the image
    req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/story/${mainImageName}`; 

    story = new Story(req.body);

    if(!story)  return res.status(400).send("failed to upload image");


        await story.save();
        req.flash('success', 'New story  has been added');
        res.location('/administrator');
        res.redirect('/administrator');

})

module.exports = router;
