const express = require('express');
const {Internship} = require('../../model/forms/internship');
const {Sponsor} = require('../../model/forms/sponsor');
const { sendMail} = require('../../utility/sendMail')
const multer = require('multer');
const upload = multer({dest : 'public/images/uploads/application'});
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
router.post('/application/intern',  upload.single('cv'), async function(req, res, next) {
   


  let FileData
  if(req.file){
    FileData                  = req.file.filename;
  }else{
   console.log('Not uploading file...',  req.body, req.file);
  }

 
    //setting the name of the image
    req.body.cv = `${req.protocol}://${req.headers.host}/images/uploads/application/${FileData}`;
 
   
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
router.post('/application/sponsor',  async function(req, res, next) {
   

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

/* GET getInvolved promoter page. */
router.get('/getinvoled/promoter',  async function(req, res, next) {
   
  res.render('getinvolved/promoter', { 
      title: 'GetInvolved'
    });
});

module.exports = router;