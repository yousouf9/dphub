const express = require('express');
const {Header} = require('../../model/General/header');
const {Team} = require('../../model/about/team');
const { DisplaceStat } = require('../../model/about/existStats');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest : 'public/images/uploads/general'});
const upload_team = multer({dest : 'public/images/uploads/team'});

const authenticate = require('../../middleware/athenticate');
const admin = require('../../middleware/admin');



/* GET Who we are page. */
router.get('/about/whoweare',  async function(req, res, next) {
       
    const header = await Header.find()
   
    if(!header) return res.status(404).send("NO Header image");
    res.render('about/whoweare', { 
        title: 'About',
        header
      });
});

/* GET why we exist page page. */
router.get('/about/whyweexist',  async function(req, res, next) {
       
    const header = await Header.find()
    if(!header) return res.status(404).send("NO Header image");

    const displaceStats= await DisplaceStat.find()
                                           .limit(1);
    let stats = null;

    if(displaceStats.length === 1){
        stats = displaceStats[0];
    }

    res.render('about/whyweexist', { 
        title: 'About',
        header,
        stats
      });
});

/* GET Team page. */
router.get('/about/team',  async function(req, res, next) {
       
    const header = await Header.find()
    if(!header) return res.status(404).send("NO Header image");

    const team = await Team.find()
    if(!team) return res.status(404).send("NO Team Image");

    res.render('about/team', { 
        title: 'About',
        header,
        teams:team
      });
});

/* GET Team Detail page. */
router.get('/about/team/:id',   async function(req, res, next) {
       
    const header = await Header.find()
    if(!header) return res.status(404).send("NO Team detail");

    const team = await Team.findOne({_id: req.params.id})
    if(!team) return res.status(404).send("Team detail not found");


    res.render('about/team_detail', { 
        title: 'About',
        header,
        team
      });
});


router.post('/administrator/whyweexist',authenticate, admin,  async(req,res) =>{

    let displaceStats= await DisplaceStat.find()
                                         .limit(1);
  


        if(displaceStats.length === 0){
            displaceStats = new DisplaceStat(req.body);
          const result = await displaceStats.save()
 
          if(!result){
                     req.flash('error', "Displacement stats failed to update")
                    return res.status(400).render('admin/about', { 
                        title: 'about',
                        user:req.currentUser
                    });
            }
        }else{

            let currentStats = {};

            displaceStats.forEach((item)=> currentStats = item);

          const result =     await DisplaceStat.updateOne({_id: currentStats._id}, {
               $set:{
                 ...req.body
               }
             }, {new: true});


             console.log("Hope it is from here", result);

        }
     //

    //const result = await displaceStats.save()
 

  //  if(!result){
    //    req.flash('error', "Displacement stats failed to update")
     //   return res.status(400).render('admin/about', { 
     //     title: 'about',
     //     user:req.currentUser
     //   });
  //  }
    console.log(displaceStats);
    req.flash('success', 'Displacement stats has been updated');
    res.location('/administrator/about');
    res.redirect('/administrator/about');
})
//Uploading Team information
router.post('/administrator/upload/team', authenticate, admin, upload_team.single('photo'), async(req,res)=>{
    let  mainImageName
    if(req.file){
        mainImageName                = req.file.filename;
    }else{
     console.log('Not uploading photo...');
     mainImageName = 'noimage.png';
    }

    //setting the name of the image
    req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/team/${mainImageName}`; 
   // setting the social
   req.body.social={
    facebook:req.body.facebook,
    twitter:req.body.twitter,
    instagram:req.body.instagram,
    google:req.body.google,
    linkin:req.body.linkin,
    whatsapp:req.body.whatsapp
   }

    team = new Team(req.body);

    if(!team){
        req.flash('error', "failed to upload team details")
      return res.status(400).render('admin/about', { 
        title: 'about',
        user:req.currentUser
      });
    }
    


        await team.save();
        req.flash('success', 'New team member has been added');
        res.location('/administrator/about');
        res.redirect('/administrator/about');

})

/** Admin section code */
/* GET Administrator about page. */
router.get('/administrator/about', authenticate, admin, async function(req, res, next) {

  const displaceStats= await DisplaceStat.find()
                                      .limit(1);
  let stats = null;
  
      if(displaceStats.length === 1){
          stats = displaceStats[0];
      }
      
    res.render('admin/about', { 
        title: 'about',
        user:req.currentUser,
        stats
      });
});
module.exports = router