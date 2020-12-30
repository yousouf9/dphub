const express = require('express');
const {Slider} = require('../../model/home/slider');
const {Partner} = require('../../model/home/partner');
const {Story} = require('../../model/home/story');
const {Location} = require('../../model/home/location');
const {Engagement} = require('../../model/home/engagement');
const {Skill} = require('../../model/home/skill_talent');
const router = express.Router();
const multer = require('multer');
const upload_slider = multer({dest : 'public/images/uploads/slider'});
const upload_partner = multer({dest : 'public/images/uploads/partner'});
const upload_story = multer({dest : 'public/images/uploads/story'});
const upload_skill_talent = multer({dest : 'public/images/uploads/skills'});

const { User} = require('../../model/user/user');
const authenticate = require('../../middleware/athenticate');
const admin = require('../../middleware/admin');


/* GET Administrator home page. */
router.get('/administrator',  authenticate, admin, async function(req, res, next) {

    const user = await User.findOne({_id: req.currentUser._id})

    if(!user) {
        req.flash('error', "Please login first")
       return res.status(400).render('/', {
      })
    }

      res.render('admin/home', { 
          title: 'home',
          user
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

//Uploading Location information
router.post('/administrator/location',  async(req,res)=>{
 
    location = new Location(req.body);

    if(!location)  return res.status(400).send("Failed to add new location");


        await location.save();
        req.flash('success', 'New location added');
        res.location('/administrator');
        res.redirect('/administrator');
})

//Uploading Engagement information
router.post('/administrator/engagement',  async(req,res)=>{
 
    engagement = new Engagement(req.body);

    if(!engagement)  return res.status(400).send("Failed to add new engagement");

        await engagement.save();
        req.flash('success', 'New engagement added');
        res.location('/administrator');
        res.redirect('/administrator');
})

//Uploading  Skill/ Talent information
router.post('/administrator/upload/skill_talent', upload_skill_talent.single('photo'), async(req,res)=>{
    let  mainImageName
    if(req.file){
        mainImageName                = req.file.filename;
    }else{
     console.log('Not uploading photo...');
     mainImageName = 'noimage.png';
    }

    //setting the name of the image
    req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/skills/${mainImageName}`; 

    skill = new Skill(req.body);

    if(!skill)  return res.status(400).send("failed to upload image");


        await skill.save();
        req.flash('success', 'New Skill/Talent  added');
        res.location('/administrator');
        res.redirect('/administrator');

})

module.exports = router;
