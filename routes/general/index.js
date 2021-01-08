const express = require('express');
const path = require('path');
const fs = require('fs')
const {Header} = require('../../model/General/header');
const {Event} = require('../../model/General/events');
const {Statistic} = require('../../model/statistics/displacement');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/general'))
const upload = multer({storage:storage});

const authenticate = require('../../middleware/athenticate');
const admin = require('../../middleware/admin');
const {Pagination} = require('../../middleware/pagination');


/* GET Administrator home page. */
router.get('/administrator/general', authenticate,admin,  async function(req, res, next) {

    const stats= await Statistic.find()
                                .limit(1);
        let data= null;

        if(stats.length === 1){
           data = stats[0];
        }
  

    const event = await Event.find();
    if(!event) return res.status(404).send("Events not found");    
    
    let page =  parseInt(req.query.page) || 1;
    const pagRes = Pagination(event, page, 5) 

    const header = await Header.find()
    if(!header) return res.status(404).send("NO Header image");

    res.render('admin/general', { 
        title: 'General',
        user:req.currentUser,
        stats: data.features,
        ID: data._id,
        events: pagRes,
        headers:header
      });
});


/* GET Event page. */
router.get('/general/events', async function(req, res, next) {
    const event = await Event.find({show:true})
                             .sort({_id:-1}) 

    
 

    if(!event) return res.status(404).send("Events not found"); 

    let page =  parseInt(req.query.page) || 1;
    const Results = Pagination(event, page, 1)

    console.log(Results);

    res.json({events: Results})

});

router.put('/general/events/:id',  async(req,res)=>{

    const event =  await Event.updateOne({_id: req.params.id}, {
        $set:{
            show:false
        }
    }, {new: true})
     if(!event)  return res.status(400).send("failed to update");

     req.flash('success', 'Events Date Time up');
    return null

})

//Deletion for events
router.delete('/event/:id', authenticate, admin,  async(req, res)=>{
       
    const event = await  Event.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!event) return res.status(404).render('admin/general', { 
            title: 'Administrator',
            user: req.currentUser
          });
          req.flash('success', "Event detail deleted")
          res.location('/administrator/general');
          res.redirect('/administrator/general');

  })
//Uploading Slider information
router.post('/administrator/upload/header', authenticate,admin, upload.single('photo'), async(req,res)=>{

    let  mainImageName
      if(req.file){
          mainImageName                = req.file.filename;
          console.log(req.file);
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

//Deletion for partner
router.delete('/header/:id', authenticate, admin,  async(req, res)=>{
       
    const header = await  Header.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!header) return res.status(404).render('admin/general', { 
            title: 'General',
            user: req.currentUser
          });


        if(header.photo !== "" && typeof header.photo !== 'undefined'){
        
            let filename = path.basename(header.photo);
            fs.unlink(`public/images/uploads/general/${filename}`, function (err) {
            if (err) throw err;
            console.log('File deleted!');
            });
        }

          req.flash('success', `${header.name} Header deleted`)
          res.location('/administrator/general');
          res.redirect('/administrator/general');

  })

//adding now event
router.post('/administrator/event', authenticate,admin, upload.single('photo'), async(req,res)=>{

     const event = new Event(req.body);

     console.log("Checking file type", req.body)

     if(!event)  return res.status(400).send("failed to upload image");

      await event.save()
      req.flash('success', 'New Event Has been added');
      res.location('/administrator/general');
      res.redirect('/administrator/general');

})  

router.post("/administrator/displacement", authenticate,admin, async(req, res)=>{

    const ID  = req.body.statID;
    const stateID = req.body.stateID;
    const totalDis = parseInt(req.body.totalDis, 10);

    const stats = await Statistic.updateOne(
                        {_id:ID, "features":{$elemMatch: {"properties.admin1Pcod": stateID}}},
                        { $set: {'features.$.properties.totalDis': totalDis} },
                        {new:true}
                        );

    if(!stats) return res.status(400)     
    req.flash('success', 'Displacement stats updated');
    res.location('/administrator/general');
    res.redirect('/administrator/general');
    
})



module.exports = router