const express = require('express');
const router = express.Router();
const {Contact, validateInput} = require('../../model/contact/index');
const {sendMail} = require('../../utility/sendMail');
const authenticate = require('../../middleware/athenticate');
const admin = require('../../middleware/admin');
const {Pagination} = require('../../middleware/pagination');
const winston   = require('winston');


/* GET CONTACT US page. */
router.get('/contact',  async function(req, res, next) {
       

    res.render('contact', { 
        title: 'Contact',
      });
});

//Uploading Engagement information
router.post('/contact',  async(req,res)=>{
 
  const {error}  = validateInput(req.body);
    
  if(typeof error !== 'undefined'){
      console.log(error)
     req.flash('error', error.details[0].message)
     return res.status(400).render('contact', {
      data: req.body
    })

  }  

  const contact = new Contact(req.body);

  if(!contact) {
       req.flash('error', "Failed to send message")
       return res.status(400).render('contact', {
       data: req.body
     })
   }

  const mailto = `${req.protocol}://${req.headers.host}`;
  const message = `<div>
                       <h2>Thank you for contacting DPHUB</h2>
                       <p>We will get back to you shortly</p>
                       <p> to know more about us<a href=${mailto}>Click here</a></p>
                   </div>`
   
  sendMail("info@dphubng.org", req.body.email, 'Thank You for contacting us', message,  async function(error, info){
  

   {
      


         if(error) {
           console.log(error);
           winston.error(error.message, error);
           req.flash('error', error.message)
          return res.status(400).render('contact', {
           data: req.body
         })

       } else {
         let result = await contact.save();

         if(!result) {
              req.flash('error', "Failed to send message")
            return  res.status(400).render('contact', {
              data: req.body
            })
          }
          req.flash('success', "Message sent!")
          res.location('/contact');
          res.redirect('/contact');

       }
     }

  }); 

})

router.get('/administrator/contact', authenticate, admin, async(req, res)=>{
   

  const contact = await Contact.find()
                               .sort({createdAt: -1})


  let page =  parseInt(req.query.page) || 1;
  const pagRes = Pagination(contact, page, 10) 


  res.render('admin/contact', {
    title:"Contact",
    user: req.currentUser,
    contacts:pagRes
  })
})

//Deletion for events
router.delete('/contact/:id', authenticate, admin,  async(req, res)=>{
       
  const contact = await  Contact.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!contact) return res.status(404).render('admin/contact', { 
          title: 'Administrator',
          user: req.currentUser
        });

        req.flash('success', "Contact detail deleted")
        res.location('/administrator/contact');
        res.redirect('/administrator/contact');

})
module.exports = router