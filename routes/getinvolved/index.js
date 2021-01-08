const express = require('express');
const fs = require('fs');
const path = require('path');
const {Internship} = require('../../model/forms/internship');
const {Sponsor} = require('../../model/forms/sponsor');
const { sendMail} = require('../../utility/sendMail')
const multer = require('multer');
const upload_internStorage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/application'))
const upload_intern = multer({storage: upload_internStorage});

const authenticate = require('../../middleware/athenticate');
const {Pagination} = require('../../middleware/pagination');

const admin = require('../../middleware/admin');
const router = express.Router();



/* GET getInvolved page. */
router.get('/getinvolved',  async function(req, res, next) {
   
    res.render('getinvolved/home', { 
        title: 'GetInvolved'
      });
});



/* GET WgetInvolved Intern page. */
router.get('/getinvolved/intern',  async function(req, res, next) {
   
    res.render('getinvolved/internshipform', { 
        title: 'GetInvolved'
      });
});

//Internship application
router.post('/application/intern',  upload_intern.single("cv"), async function(req, res, next) {
   


  let FileData
  if(req.file){
    FileData                  = req.file.filename;
  }else{
   console.log('Not uploading file...',  req.body, req.file);
  }

 
    //setting the name of the image
    req.body.cv = `${req.protocol}://${req.headers.host}/images/uploads/application/${FileData}`;
    
        for(let key in req.body){
            if(key === "human_right") req.body.human_right = "Human Right"
            if(key === "skill") req.body.skill = "Skills/Talent Promotion"
            if(key === "advocacy") req.body.advocacy = "Advocacy"
            if(key === "wash") req.body.wash = "WASH"
            if(key === "dc") req.body.dc = "Development and Communications"
            if(key === "hr") req.body.hr = "Human Resource"
            if(key === "policy") req.body.policy = "Policy"
            if(key === "me") req.body.me = "Monitering and Evaluation"
            if(key === "cr") req.body.cr = "Conflict Resolution"

        }
   
      req.body.interesArea = {
          human_right: req.body.human_right,
          skill:req.body.skill,
          advocacy:req.body.advocacy,
          wash:req.body.wash,
          dc:req.body.dc,
          hr:req.body.hr,
          policy:req.body.policy,
          me:req.body.me,
          cr:req.body.cr
      }
      
    let intern = await Internship.findOne({email: req.body.email});
      if(intern) {
        req.flash('error', "Application already exist!")
        return res.status(400).render('getinvolved/internshipform', {
          title: 'GetInvolved', 
         data: req.body
       })
    }

     intern = new Internship(req.body);
    if(!intern) {
         req.flash('error', "Failed to submit application! try again ")
          return res.status(400).render('getinvolved/internshipform', {
          title: 'GetInvolved', 
         data: req.body
       })
     }

 


     const mailto = `${req.protocol}://${req.headers.host}`;
     const message = `<div>
                          <h2>Thank you for submitting an application DPHUB</h2>
                          <p>We will contact for forward directive</p>
                          <p>to know more about us<a href=${mailto}>Click here</a></p>
                      </div>`
     sendMail("info@dphubng.org", req.body.email, 'Application Submitted!', message,  async function(error, info){
     
   
      {
         
   
            if(error) {
              console.log(error);
              winston.error(error.message, error);
              req.flash('error', error.message)
              
             return res.status(400).render('getinvolved/internshipform', {
              data: req.body
            })
          
   
          } else {

            let result = await intern.save();
           
   
            if(!result) {
                 req.flash('error', "Failed to submit application")
               return  res.status(400).render('getinvolved/internshipform', {
                 data: req.body
               })
             }
             req.flash('success', 'Application submitted');
             res.location('/getinvolved');
             res.redirect('/getinvolved');
           
          }
        }
   
     }); 
  
     ;

});

//Application for Sponsorship
router.post('/application/sponsor', authenticate,admin,  async function(req, res, next) {
   

    const  sponsor = new Sponsor(req.body);
    if(!sponsor) {
         req.flash('error', "Please Fill the required field")
          return res.status(400).render('getinvolved/promoter', {
          title: 'GetInvolved', 
         data: req.body
       })
     }

     const mailto = `${req.protocol}://${req.headers.host}`;
     const message = `<div>
                          <h2>Thank you for choosing to support us</h2>
                          <p>We will be contacting you for more details shortly</p>
                          <p>to know more about us<a href=${mailto}>Click here</a></p>
                      </div>`
     sendMail("info@dphubng.org", req.body.email, 'Application Submitted!', message,  async function(error, info){
     
   
      {
         
   
            if(error) {
              console.log(error);
              winston.error(error.message, error);
              req.flash('error', error.message)
              
             return res.status(400).render('getinvolved/internshipform', {
              data: req.body
            })
          
   
          } else {

            let result = await sponsor.save();
           
   
            if(!result) {
                 req.flash('error', "Failed to submit application")
               return  res.status(400).render('getinvolved/promoter', {
                 data: req.body
               })
             }
             req.flash('success', 'Application submitted');
             res.location('/getinvolved');
             res.redirect('/getinvolved');
           
          }
        }
   
     }); 
  
     ;

});

//GET getInvolved admin page
router.get('/administrator/get_involved', authenticate, admin, async(req, res)=>{




  const intern = await Internship.find()
                               .sort({_id: -1});

    
  const sponsor = await Sponsor.find()
                               .sort({_id: -1});

  let ipage =  parseInt(req.query.ipage) || 1;
  const iResults = Pagination(intern, ipage, 5)

  let spage =  parseInt(req.query.spage) || 1;
  const sResults = Pagination(sponsor, spage, 5)


  res.render('admin/getinvolved', {
    title:"GetInvolved",
    user: req.currentUser,
    internships:iResults,
    sponsors: sResults
  })
})

//Deletion internship
router.delete('/internship/:id', authenticate, admin,  async(req, res)=>{
       
  const internship = await  Internship.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!internship) return res.status(404).render('admin/getinvolved', { 
          title: 'GetInvolved',
          user: req.currentUser
        });
        if(internship.cv !== ""){
        
          let filename = path.basename(internship.cv);

          console.log(filename);
          fs.unlink(`public/images/uploads/application/${filename}`, function (err) {
          if (err) throw err;
          console.log('File deleted!');
          });
      }

        req.flash('success', "Internship detail deleted")
        res.location('/administrator/get_involved');
        res.redirect('/administrator/get_involved');

})

//Deletion for events
router.delete('/sponsor/:id', authenticate, admin,  async(req, res)=>{
       
  const sponsor = await  Sponsor.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!sponsor) return res.status(404).render('admin/getinvolved', { 
          title: 'GetInvolved',
          user: req.currentUser
        });
        req.flash('success', "Sponsor detail deleted")
        res.location('/administrator/get_involved');
        res.redirect('/administrator/get_involved');

})

/* GET getInvolved promoter page. */
router.get('/getinvolved/promoter',  async function(req, res, next) {
   
  res.render('getinvolved/promoter', { 
      title: 'GetInvolved'
    });
});
module.exports = router;