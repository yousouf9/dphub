const express = require('express');
const router = express.Router();
const {User} = require('../../model/user/user');
const {Skill_Talent} = require('../../model/user/skill');
const { indexOf } = require('lodash');

/* GET Skill Profiling  page. */
router.get('/whatwedo/skill_profile',  async function(req, res, next) {
  
  let search = req.query.search;
  console.log("getting error", search);

  let skill
  if(search){
    skill = await Skill_Talent.find({skill : {$regex: `${search}`, $options: 'i'}})
                              .populate('user')
    if(skill.length === 0) {
      req.flash('success', "Press Article Not found")
      skill = await Skill_Talent.find()
                         .populate('user');
    }
  }else{
    skill = await Skill_Talent.find()
                              .populate('user');
  }
   

   
  if(!skill) return res.status(404).send("No skills available");


  let skillsArray = [...new Set(skill)];
   
  skillsArray.filter((item, index) => skillsArray.indexOf(item)=== index);

   skillsArray.reduce((unique, item)=> 

      unique.skill !== item.skill ? unique : [...unique, item], []
  )
   
  console.log("Yes yes it is from here", skillsArray);

  res.render('whatwedo/skill', { 
    title: 'WhatWeDo',
    skills: skillsArray
  });
});


/* GET talent Profiling  page. */
router.get('/whatwedo/talent_profile',  async function(req, res, next) {
   
    res.render('whatwedo/talent', { 
        title: 'WhatWeDo'
      });
});

/* GET DP complain   page. */
router.get('/whatwedo/dp_complain',  async function(req, res, next) {
   
    res.render('whatwedo/dp_complain', { 
        title: 'WhatWeDo'
      });
});

/* GET talent Profiling  page. */
router.get('/whatwedo/displace_monitor',  async function(req, res, next) {
   
    res.render('whatwedo/displace', { 
        title: 'WhatWeDo'
      });
});

/* GET Who we are page. */
router.get('/getinvoled/intern',  async function(req, res, next) {
   
    res.render('getinvolved/internshipform.pug', { 
        title: 'GetInvolved'
      });
});

module.exports = router;