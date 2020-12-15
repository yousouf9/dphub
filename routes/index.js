const express = require('express');
const {Slider} = require('../model/home/slider')
const {Partner} = require('../model/home/partner')
const {Story} = require('../model/home/story')
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

    res.render('index', { title: 'Home',
            sliders: slider,
            partners: partner,
            stories: story

    });
});

module.exports = router;
