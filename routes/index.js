const express = require('express');
const {Slider} = require('../model/home/slider')
const {Partner} = require('../model/home/partner')
const {Story} = require('../model/home/story')
const {Skill} = require('../model/home/skill_talent')
const {Location} = require('../model/home/location')
const {Engagement} = require('../model/home/engagement');
const { first } = require('lodash');
const router = express.Router();

/* GET home page. */
router.get('/',  async function(req, res, next) {

  const slider = await Slider.find();
  if(!slider) return res.status(404).send("NO Image Slider");

  const partner = await Partner.find()
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

    console.log(items)
    res.render('index', { title: 'Home',
            sliders: slider,
            partners: partner,
            stories: story,
            location,
            engagement,
            items

    });
});

module.exports = router;
