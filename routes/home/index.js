const express = require('express');
const fs = require('fs');
const path = require('path')
const {Slider} = require('../../model/home/slider');
const {Partner} = require('../../model/home/partner');
const {Story} = require('../../model/home/story');
const {Location} = require('../../model/home/location');
const {Engagement} = require('../../model/home/engagement');
const {Skill} = require('../../model/home/skill_talent');
const router = express.Router();
const multer = require('multer');

const upload_sliderStorage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/slider'))
const upload_slider = multer({storage: upload_sliderStorage});

const upload_partnerStorage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/partner'))
const upload_partner = multer({storage:upload_partnerStorage});

const upload_storyStorage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/story'))
const upload_story = multer({storage:upload_storyStorage});

const upload_skill_talentStorage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/skills'))
const upload_skill_talent = multer({storage:upload_skill_talentStorage});


const {Pagination} = require('../../middleware/pagination');

const { User} = require('../../model/user/user');
const authenticate = require('../../middleware/athenticate');
const admin = require('../../middleware/admin');




/* GET Administrator home page. */
router.get('/administrator',  authenticate, admin, async function(req, res, next) {

    const slider = await Slider.find();
    if(!slider) return res.status(404).send("NO Image Slider");

    const partner = await Partner.find()
    if(!partner) return res.status(404).send("NO partner found");

    const story = await Story.find()
    if(!story) return res.status(404).send("NO story found");

    let spage =  parseInt(req.query.spage) || 1;
    const spagRes = Pagination(story, spage, 5) 

    const location = await Location.find()
    if(!location) return res.status(404).send("NO location found");

    let lpage =  parseInt(req.query.lpage) || 1;
    const lpagRes = Pagination(location, lpage, 5) 
  
    const engagement = await Engagement.find()
    if(!engagement) return res.status(404).send("NO engagement found");

    let epage =  parseInt(req.query.epage) || 1;
    const epagRes = Pagination(engagement, epage, 5)
  
  
   // const talent = await Skill_Talent.find()
    //if(!talent) return res.status(404).send("NO Talents/skill found");

    const skill = await Skill.find()
    if(!skill) return res.status(404).send("NO skill found");

    const user = await User.findOne({_id: req.currentUser._id})

    if(!user) {
        req.flash('error', "Please login first")
       return res.status(400).render('/', {
      })
    }

      res.render('admin/home', { 
          title: 'Administrator',
          user,
          sliders: slider,
          partners: partner,
          stories: spagRes,
          locations: lpagRes,
          engagements: epagRes,
         // talents:talent, 
          skills: skill
        });
});


//Uploading Slider information
router.post('/administrator/upload/slider', authenticate, admin, upload_slider.single('photo'), async(req,res)=>{

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
//Administration sections

//Deletion for slider
router.delete('/slider/:id', authenticate, admin,  async(req, res)=>{
       

        const slider = await  Slider.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        
        
        if(!slider) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          })


        if(slider.photo !== ""){

            let filename = path.basename(slider.photo);
        
            fs.unlink(`public/images/uploads/slider/${filename}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            });
        }

          req.flash('success', "Home Page Slider Image Deleted")
          res.location('/administrator');
          res.redirect('/administrator');

  })
//Uploading Partner information
router.post('/administrator/upload/partner', authenticate, admin, upload_partner.single('photo'), async(req,res)=>{

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
//Deletion for partner
router.delete('/partner/:id', authenticate, admin,  async(req, res)=>{
       
    const partner = await  Partner.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!partner) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          });


          if(!partner) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          })


        if(partner.photo !== ""){
        

            let filename = path.basename(partner.photo);
        
            fs.unlink(`public/images/uploads/partner/${filename}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            });
        }

          req.flash('success', "Parter detail deleted")
          res.location('/administrator');
          res.redirect('/administrator');

  })
//Uploading Story information
router.post('/administrator/upload/story', authenticate, admin, upload_story.single('photo'), async(req,res)=>{
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
//Deletion for story
router.delete('/story/:id',  authenticate, admin, async(req, res)=>{
       
    const story = await  Story.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!story) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          });


          if(!story) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          })


        if(story.photo !== ""){
        

            let filename = path.basename(story.photo);
        
            fs.unlink(`public/images/uploads/story/${filename}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            });
        }

          req.flash('success', "story detail deleted")
          res.location('/administrator');
          res.redirect('/administrator');

  })
//Uploading Location information
router.post('/administrator/location', authenticate, admin,  async(req,res)=>{
 
    location = new Location(req.body);

    if(!location)  return res.status(400).send("Failed to add new location");


        await location.save();
        req.flash('success', 'New location added');
        res.location('/administrator');
        res.redirect('/administrator');
})

//Deletion for location
router.delete('/location/:id', authenticate, admin,  async(req, res)=>{
       
    const location = await  Location.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!location) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          });
          req.flash('success', "Location detail deleted")
          res.location('/administrator');
          res.redirect('/administrator');

  })
//Uploading Engagement information
router.post('/administrator/engagement', authenticate, admin, async(req,res)=>{
 
    engagement = new Engagement(req.body);

    if(!engagement)  return res.status(400).send("Failed to add new engagement");

        await engagement.save();
        req.flash('success', 'New engagement added');
        res.location('/administrator');
        res.redirect('/administrator');
})

//Deletion for Engagement
router.delete('/engagement/:id',  authenticate, admin,  async(req, res)=>{
       
    const engagement = await  Engagement.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!engagement) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          });

          req.flash('success', "Engagement detail deleted")
          res.location('/administrator');
          res.redirect('/administrator');

  })

//Uploading  Skill/ Talent information
router.post('/administrator/upload/skill_talent', authenticate, admin, upload_skill_talent.single('photo'), async(req,res)=>{
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

//Deletion for Talent/skill slider
router.delete('/skill_talent/:id', authenticate, admin,  async(req, res)=>{
       
    const skill = await  Skill.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!skill) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          });


          if(!skill) return res.status(404).render('admin/home', { 
            title: 'Administrator',
            user: req.currentUser
          })
        if(skill.photo !== ""){
        

            let filename = path.basename(skill.photo);
        
            fs.unlink(`public/images/uploads/skills/${filename}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            });
        }

          req.flash('success', "Skill detail deleted")
          res.location('/administrator');
          res.redirect('/administrator');

  })
module.exports = router;
