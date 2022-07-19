const express = require('express');
const fs = require('fs')
const path = require('path');
const {Complaint} = require('../../model/forms/dp_complain');
const {Pagination}= require('../../middleware/pagination');
const authenticate= require('../../middleware/athenticate');
const admin= require('../../middleware/admin');

const router = express.Router();


/* Administrator. */
//get Admin complait details

router.get('/administrator/complaint',  authenticate, admin, async(req, res)=>{

    const complaint = await Complaint.find()
                                     .sort({createdAt: -1})

    let page =  parseInt(req.query.page) || 1;
    const pagRes = Pagination(complaint, page, 8) 

    res.render("admin/complaint", {
        title:"Complaints",
        user:req.currentUser,
        complaints:pagRes
    })
})

//Deletion Report
router.delete('/administrator/complaint/:id', authenticate, admin,  async(req, res)=>{
       
    const complaint = await  Complaint.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
          if(!complaint) return res.status(404).render('admin/complaint', { 
            title:"Complaints",
            user: req.currentUser
          });
    
         if(complaint.attachment !== ""){
            let filename = path.basename(complaint.attachment);
            fs.unlink(`public/images/uploads/application/${filename}`, function(err) {
            if (err) throw err;
            console.log('File deleted!');
            });
          }

          req.flash('success', "Complaint detail deleted")
          res.location('/administrator/complaint');
          res.redirect('/administrator/complaint');
  
  })

module.exports = router;