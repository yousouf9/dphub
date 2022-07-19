const express = require('express');
const {User} = require('../../model/user/user');
const {Header} = require('../../model/General/header');
const {Skill_Talent} = require('../../model/user/skill');
const {Displacement} = require('../../model/user/displacement');
const {Complaint, validateComplaintForm} = require('../../model/forms/dp_complain');
const {Story} = require('../../model/home/story');
const {Monitor} = require('../../model/whatwedo/monitor');
const {ReportCase} = require('../../model/whatwedo/report');
const {Alert} = require('../../model/whatwedo/index');
const authenticate = require('../../middleware/athenticate');
const admin = require('../../middleware/admin');
const {Statistic} = require('../../model/statistics/displacement');
const {Pagination} = require('../../middleware/pagination');
const multer = require('multer');
const uploadStorage = multer.diskStorage(require('../../middleware/multerstorage')('public/images/uploads/application'))
const upload = multer({storage: uploadStorage});

const router = express.Router();

/* GET Skill Profiling  page. */
router.get('/whatwedo/skill_profile',  async function(req, res, next) {
  
  let search = req.query.search;
  let skill
  if(search){
    skill = await Skill_Talent.find({skill : {$regex: `${search}`, $options: 'i'}})
                              .populate('user')
    if(skill.length === 0) {
      req.flash('error', "No user is registered with this skills")
      skill = await Skill_Talent.find()
                         .populate('user');
    }
  }else{
    skill = await Skill_Talent.find()
                              .populate('user');
  }
   

   
  if(!skill) return res.status(404).send("No skills available");

  let skillsArray = [...new Set(skill)];


    const result = [];
    const map = new Map();
    for (const item of skillsArray) {
        if(!map.has(item.user._id)){
            map.set(item.user._id, true);    // set any value to Map
            result.push({
                _id: item._id,
                skill: item.skill,
                user: item.user
            });
        }
    }

    let page =  parseInt(req.query.page) || 1;
    const pagRes = specialPagination(result, page, 8) 

  res.render('whatwedo/skill', { 
    title: 'WhatWeDo',
    skills: pagRes
  });
});


/* GET talent Profiling  page. */
router.get('/whatwedo/talent_profile',  async function(req, res, next) {

   
  let search = req.query.search;
  let skill
  if(search){
    skill = await Skill_Talent.find({skill : {$regex: `${search}`, $options: 'i'}})
                              .populate('user')
    if(skill.length === 0) {
      req.flash('error', "No user is registered with this skills")
      skill = await Skill_Talent.find()
                         .populate('user');
    }
  }else{
    skill = await Skill_Talent.find()
                              .populate('user');
  }
   

   
  if(!skill) return res.status(404).send("No skills available");

  let skillsArray = [...new Set(skill)];


    const result = [];
    const map = new Map();
    for (const item of skillsArray) {
        if(!map.has(item.user._id)){
            map.set(item.user._id, true);    // set any value to Map
            result.push({
                _id: item._id,
                skill: item.skill,
                user: item.user
            });
        }
    }

    let page =  parseInt(req.query.page) || 1;
    const pagRes = specialPagination(result, page, 8) 

  res.render('whatwedo/talent', { 
    title: 'WhatWeDo',
    skills: pagRes
  });
});

/* GET DP complain   page. */
router.get('/whatwedo/dp_complain',  async function(req, res, next) {

  const header = await Header.find()
  if(!header) return res.status(404).send("NO Header image");
   
  const report = await ReportCase.find()
                                  .sort({_id: -1})
                                  .limit(8);
  if(!report) return res.status(404).send("Reports case empty");

  console.log(report);
    res.render('whatwedo/dp_complain', { 
        title: 'WhatWeDo',
        header,
        reports:report
      });
});

/* GET DP complain form  page. */
router.get('/whatwedo/dp_complain/form',  async function(req, res, next) {

  const header = await Header.find()
  if(!header) return res.status(404).send("NO Header image");
   
    res.render('whatwedo/dp_complainform', { 
        title: 'WhatWeDo',
        header
      });
});

/* GET DP complain alert page  page. */
router.get('/whatwedo/dp_complain/alert',  async function(req, res, next) {

  let search = req.query.search

  let sgbvPage =  req.query.sgbvPage;
  let traffickPage =  req.query.traffickPage;
  let otherPage = req.query.otherPage;



  let alert, sgbv, traffick, other;


  if(search){
    alert = await Alert.find({title : {$regex: `${search}`, $options: 'i'}})
                       .sort({_id: -1});
    if(alert.length === 0) {
      req.flash('error', "Alert with title not founded")
      alert  = [] ;
    }
  }else{
    alert  = [] ;
  }


  if(sgbvPage){
    sgbv = await Alert.find({category : {$regex: `SGBV`, $options: 'i'}})
                       .sort({_id: -1});

  }else{
      sgbv = await Alert.find({category : {$regex: `SGBV`, $options: 'i'}})
                       .sort({_id: -1});
  }

  if(traffickPage){
    traffick = await Alert.find({category : {$regex: `TRAFFICKING`, $options: 'i'}})
                       .sort({_id: -1});

  }else{
    traffick = await Alert.find({category : {$regex: `TRAFFICKING`, $options: 'i'}})
    .sort({_id: -1});
  }

  if(otherPage){
    other = await Alert.find({category : {$regex: `OTHER COMPLAIN`, $options: 'i'}})
                       .sort({_id: -1});

  }else{
    other = await Alert.find({category : {$regex: `OTHER COMPLAIN`, $options: 'i'}})
    .sort({_id: -1});
  }

  let searchPage =  parseInt(req.query.searchPage) || 1;
  const searchRes = Pagination(alert, searchPage, 5) 

     sgbvPage =  parseInt(req.query.sgbvPage) || 1;
const  sgbvRes  = Pagination(sgbv, sgbvPage, 5) 

      traffickPage =  parseInt(req.query.traffickPage) || 1;
     const  traffickRes = Pagination(traffick, traffickPage, 5) 

    otherPage =  parseInt(req.query.otherPage) || 1;
  const otherRes = Pagination(other, otherPage, 5) 


  const header = await Header.find()
  if(!header) return res.status(404).send("NO Header image");

    res.render('whatwedo/alert', { 
        title: 'WhatWeDo',
        header,
        search: searchRes,
        searchKey:search,
        sgbvs: sgbvRes,
        trafficks: traffickRes,
        others: otherRes,
      });
});
/* GET talent Profiling  page. */
router.get('/whatwedo/displace_monitor',  async function(req, res, next) {

const totalDisplacePerson = await User.find({admin:false})
                                      .count();
const conflict_violence = await Displacement.find({$or:[{"boko_haram": "Boko Haram"}, {"bandit": "Bandit"},{"communal_crisis": "Communal Crisis"}]})
                                             .count();
const disaster = await Displacement.find({$or:[{"flood": "Flood"}, {"other":"Other"}]})
                                    .count();

  const header = await Header.find()
  if(!header) return res.status(404).send("NO Header image");

  const monitor = await Monitor.find()
  if(!monitor) return res.status(404).send("No monitor data")

const story = await Story.find()
                         .limit(12);
   
  console.log("Num of disaster",disaster);
    res.render('whatwedo/displace', { 
        title: 'WhatWeDo',
        header,
        totalDisplacePerson,
        conflict_violence,
        disaster,
        stories: story,
        monitors: monitor
      });
});


router.post("/dp_complain_form", upload.single('attachment'), async(req, res)=>{


  let type_of_abuse = [];
  let other_complain = [];

  for(let key in req.body){
    if(key === "victim_sex") req.body.human_right = "Human Right"
    if(key === "skill") req.body.skill = "Skills/Talent Promotion"
    if(key === "advocacy") req.body.advocacy = "Advocacy"
}

  for(let key in req.body){
    if(key === "rape")   type_of_abuse.push("Rape")
    if(key === "sh")   type_of_abuse.push("Sexual harassment")
    if(key === "stalking")   type_of_abuse.push("Stalking")
    if(key === "sa")   type_of_abuse.push("Sexual assult")
    if(key === "discrimination")   type_of_abuse.push("Discrimination")
    if(key === "se")  type_of_abuse.push("Sexual exploitation")
    if(key === "retaliation")   type_of_abuse.push("Retaliation")
    if(key === "gbh")   type_of_abuse.push("Gender-based harassment")
    if(key === "na")   type_of_abuse.push("NA")


    if(key === "trafficking") other_complain.push("Trafficking")
    if(key === "extortion") other_complain.push("Extortion")
    if(key === "starvation") other_complain.push("Starvation")
    if(key === "dfs") other_complain.push("Diversion food stuff")
    if(key === "do") other_complain.push("Disease outbreak")
    if(key === "ona") other_complain.push("NA")
 }

 req.body.type_of_abuse = type_of_abuse;
 req.body.other_complain = other_complain;



  console.log("Form data",req.body);

  const {error}  = validateComplaintForm(req.body);
  if(typeof error !== 'undefined'){
    req.flash('error', error.details[0].message)
      res.status(400).render('whatwedo/dp_complainform', { 
      title: 'WhatWeDo',
      data: req.body,
    })

  }

  let FileData
  if(req.file){
    FileData                  = req.file.filename;
  }else{
   console.log('Not uploading file...');
  }

 //Attachment URL
  req.body.attachment = `${req.protocol}://${req.headers.host}/images/uploads/application/${FileData}`;





  const complaits = new Complaint(req.body);
  
  const result = await complaits.save();

  if(!result){ 
    
    req.flash('error', "Failed to submit complait")
    res.status(400).render(
    'whatwedo/dp_complainform', { 
      title: 'WhatWeDo',
      data: req.body,
    }
  )
  }
  
  req.flash("success", "Your complaint is received");
  res.location("/whatwedo/dp_complain")
  res.redirect("/whatwedo/dp_complain")



})


//Administrator section
//Get what we do
router.get("/administrator/what_we_do", authenticate, admin,  async(req, res)=>{

  const stats= await Statistic.find()
                              .limit(1);
    let data= null;

    if(stats.length === 1){
      data = stats[0];
    }

  res.render('admin/whatwedo', {
    title: "Whatwedo",
    user:req.currentUser,
    stats: data.features,
    ID: data._id

  })
})
//POST Update monitor data
router.post("/administrator/monitor", authenticate, admin, async(req, res)=>{

  const  monitor = new Monitor(req.body);
  
  const result = await monitor.save();
  if(!result){
    req.flash('error', "Failed to added new monitor data")
    res.render('admin/whatwedo', {
      user:req.currentUser,
      data: req.body
    })
  }
  req.flash('success', "New Monitor case uploaded")
  res.location('/administrator/what_we_do');
  res.redirect('/administrator/what_we_do');
})

//POST Report case update
router.post("/administrator/dp_complain/report", authenticate, admin, async(req, res)=>{

  const  report = new ReportCase(req.body);
  
  const result = await report.save();
  if(!result){
    req.flash('error', "Failed to update report case")
    res.render('admin/whatwedo', {
      user:req.currentUser,
      data: req.body
    })
  }
  req.flash('success', "New report case has been added")
  res.location('/administrator/what_we_do');
  res.redirect('/administrator/what_we_do');
})
//POST Alert updates
router.post("/administrator/dp_complain/alert", authenticate, admin, async(req, res)=>{

  const  alert = new Alert(req.body);
  
  const result = await alert.save();
  if(!result){
    req.flash('error', "Failed to update alert")
    res.render('admin/whatwedo', {
      user:req.currentUser,
      data: req.body
    })
  }
  req.flash('success', "New alert updated")
  res.location('/administrator/what_we_do');
  res.redirect('/administrator/what_we_do');
})
router.post("/administrator/report/stat", authenticate,admin, async(req, res)=>{

  const ID  = req.body.statID;
  const stateID = req.body.stateID;
  const report = parseInt(req.body.report, 10);

  const stats = await Statistic.updateOne(
                      {_id:ID, "features":{$elemMatch: {"properties.admin1Pcod": stateID}}},
                      { $set: {'features.$.properties.reports': report} },
                      {new:true}
                      );


  if(!stats) return res.status(400)   
  req.flash('success', 'Reports  stats updated');
  res.location('/administrator/what_we_do');
  res.redirect('/administrator/what_we_do');
  
})



const specialPagination = (model, page, limit ) => {


  const totalPages = Math.ceil(model.length / limit);

   console.log(totalPages);
   let first = {}, second= {}, third = {};


   if(totalPages === 1){ 
      first = {
        value:1,
        current:"paginateCurrent"
      }
    }

   if(totalPages === 2) {
    first={value:1}; 
    second={value : 2}
     if(page === 1){
      first['current'] ="paginateCurrent"
     }else{second['current'] = "paginateCurrent"}
    } 

   if(totalPages === 3){
 
    first={value:1}; 
    second={value : 2}
    third={value : 3}

      if(page === 1){
        first['current'] ="paginateCurrent"
      }else if(page === 2){
        second['current'] = "paginateCurrent"
      }else{
        third['current'] = "paginateCurrent";
      }
  
  }

  if( page === 1 &&  totalPages > 3){
    first={value:1}; 
    second={value : 2}
    third={value : 3}
    first["current"] ="paginateCurrent"
  }

  if(page === 2 && totalPages > 3){
    first={value:1}; 
    second={value : 2}
    third={value : 3}
    second["current"] ="paginateCurrent"
  }

  if( page === 3 && totalPages > 3){
    first={value:1}; 
    second={value : 2}
    third={value : 3}
    third["current"] ="paginateCurrent"
  }

  let counter = 1;

  if(page > 3){
    for(let i = page; i > 0; i--){
      if(counter ===1) third ={ value:i, current: "paginateCurrent"}
      if(counter ===2) second ={ value:i}
      if(counter ===3){
         first={ value:i}
         break;
      }

      counter++
    }
  }


  const startIndex = (page - 1) * limit;
  const  endIndex = page * limit;

  const results = {};

  if(endIndex < model.length){
      results.next = {
          page : page + 1,
          limit: limit
      }
  }

  if(startIndex > 0){
    results.previous = {
        page : page - 1,
        limit: limit
    }
  }

  results.first = first;
  results.second = second;
  results.third = third;
  results.totalPages =  totalPages;
  results.results = model.slice(startIndex, endIndex);
     return results;

}

module.exports = router;