const express = require('express');
const {Slider} = require('../model/home/slider')
const {Partner} = require('../model/home/partner')
const {Story} = require('../model/home/story')
const {Skill} = require('../model/home/skill_talent')
const {Location} = require('../model/home/location')
const {Engagement} = require('../model/home/engagement');
const {Skill_Talent}= require("../model/user/skill");
const { Statistic} = require('../model/statistics/displacement');
const {Displacement} = require('../model/user/displacement');
const { User } = require("../model/user/user");
const router = express.Router();


/* GET home page. */
router.get('/',  async function(req, res, next) {

  const slider = await Slider.find();
  if(!slider) return res.status(404).send("NO Image Slider");

  const partner = await Partner.find()
                               .select({photo: 1})                         
                               .limit(16)


 let partnerItems = {}

    partner.forEach((item, i)=>{
      if(i==0)  partnerItems["first"] = [];
        if(i < 4){
                                    
          partnerItems.first.push(item)
         }
                           
      if(i==4)  partnerItems["second"] = [];
        if(i > 3 && i < 8 ){
                                    
          partnerItems.second.push(item)
        }
                           
      if(i==8)  partnerItems["third"] = [];
        if(i > 7 && i < 12 ){
          partnerItems.third.push(item)
       }
      if(i==12)  partnerItems["fourth"] = [];
        if(i > 11 && i < 16 ){
          partnerItems.fourth.push(item)
         }  
    })

  if(!partner) return res.status(404).send("NO partner found");

  const story = await Story.find()
                           .sort({_id:-1})
                           .limit(6)

  
  if(!story) return res.status(404).send("NO story found");

  const location = await Location.find()
                                 .count();
  if(!location) return res.status(404).send("NO location found");

  const engagement = await Engagement.find()
                                     .count();
  if(!engagement) return res.status(404).send("NO engagement found");


  const talent = await Skill_Talent.find()
                                   .count();
  if(!talent) return res.status(404).send("NO Talents/skill found");


  //Skills and talent display

  const skill = await Skill.find()
                           .select({photo: 1})                         
                           .limit(16)


  if(!skill) return res.status(404).send("NO skill found");

  let items = {}

    skill.forEach((item, i)=>{
         if(i==0)  items["first"] = [];
         if(i < 4){
         
        items.first.push(item)
         }

         if(i==4)  items["second"] = [];
         if(i > 3 && i < 8 ){
         
          items.second.push(item)
           }

           if(i==8)  items["third"] = [];
           if(i > 7 && i < 12 ){
            items.third.push(item)
             }
            if(i==12)  items["fourth"] = [];
            if(i > 11 && i < 16 ){
            items.fourth.push(item)
              }  
    })


    const totalDisplacePerson = await User.find({admin:false})
                                          .count();
    const conflict_violence = await Displacement.find({$or:[{"boko_haram": "Boko Haram"}, {"bandit": "Bandit"},{"communal_crisis": "Communal Crisis"}]})
                                                .count();
    const disaster = await Displacement.find({$or:[{"flood": "Flood"}, {"other":"Other"}]})
                                       .count();
    res.render('index', { title: 'Home',
            sliders: slider,
            partners: partnerItems,
            stories: story,
            location,
            engagement,
            items,
            talent,
            totalDisplacePerson,
            conflict_violence,
            disaster

    });
});


router.get("/displacement", async(req, res)=>{

    const stats= await Statistic.find()
                                .limit(1);
      let data= null;

      if(stats.length === 1){
        data = stats[0];
      }

    res.send({data:data})
})


router.post("/displacement", async(req, res)=>{
  const stats = new Statistic()

      await stats.save()
    res.send(stats)
})


//News details
router.get('/news/:id',  async function(req, res, next) {
  //using same variable press here in order to use thesame detail template  
const article = await Story.findOne({_id: req.params.id});
if(!article) return res.status(404).send("This article is not available");

res.render('news/newsdetail', { 
   title: 'News',
   article
 });
});
module.exports = router;
