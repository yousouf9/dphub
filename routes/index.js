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
const { User , validateUser} = require("../model/user/user");
const {Pagination}= require('../middleware/pagination');
const authenticate= require('../middleware/athenticate');
const admin= require('../middleware/admin');

const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



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
  //if(!location) return res.status(404).send("NO location found");

  const engagement = await Engagement.find()
                                     .count();
  //if(!engagement) return res.status(404).send("NO engagement found");


  const talent = await Skill_Talent.find()
                                   .count();
 // if(!talent) return res.status(404).send("NO Talents/skill found");


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



passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, async function(err, user) {
          if(err) throw new Error(err);
             
          if(!user) {
            console.log('not a valide user');
            return done(null, false, {message: 'unknown user'});
          }
          
          if(user.admin==="false"){
            console.log('Not and admin');
            return done(null, false, {message: 'You dont have permission for here'});
          }

          const isValid =  await User.validatePassword(password, user.password)
          if(!isValid){
              console.log('Password did not matched')
              return done(null, false);
          } 

          return done(null, user);

       });
    }

));

router.get('/administrator/login', function(req, res, next) {
  res.render('admin/login', { title: 'Login' });
});

router.post('/administrator/login',
 passport.authenticate('local', {failureRedirect:'/administrator/login', failureFlash:'invalid username or password'}),

 async(req, res)=>{

  const loginToken = await User.sendEmailToken(req.user._id);
    //update user account verification token  
    //hash user password  
   const user = await User.findById(req.user._id); 
   user.loginToken= loginToken;

    await user.save();


  req.flash('success','you are logged in');
  res.cookie('x-auth',  loginToken);

    res.location(`/administrator`)
    res.redirect(`/administrator`)
  
})

/** Register a new Admin user */

router.post('/administrator/add', authenticate, admin, async (req, res)=>{

  const {error}  = validateUser(req.body);
  
  if(typeof error !== 'undefined'){
     
      console.log(error);

     req.flash('error', error.details[0].message)
     res.status(400).render('admin/register', {
      data: req.body,
      user: req.currentUser
    })

  }

  const isEmailAvailable =await User.findOne({email: req.body.email});
  const usernameAvailable =await User.findOne({username: req.body.username});
  
  if(isEmailAvailable){
     req.flash('error', "Admin User with email already exist!")
    return res.status(400).render('admin/register', {
     data: req.body,
     user: req.currentUser
   })
  }

  if(usernameAvailable){
    req.flash('error', " Admin Username already exist!")
    res.status(400).render('admin/register', {
    data: req.body,
    user: req.currentUser
  })
 }

  req.body.admin = true;
  req.body.isVerified = true;
 const user = new User(req.body);

 if(!user) {
      req.flash('error', "Failed to create admin user")
     return res.status(400).render('admin/register', {
      data: req.body,
      user: req.currentUser
    })
  }


  
   const verificationToken = await User.sendEmailToken(user._id);
   //update user account verification token  
   //hash user password  
   user.token= verificationToken;
   user.password =await User.encryptPassword(user.password);

   let result = await user.save();

   if(!result) {
        req.flash('error', "Failed to create user")
     return   res.status(400).render('admin/register', {
        data: req.body,
        user: req.currentUser
      })
    }

    req.flash('success', "Admin user created")
    res.location(`/administrator/registerdetail/${result._id}`);
    res.redirect(`/administrator/registerdetail/${result._id}`);

 
})

router.get("/administrator/users", authenticate, admin,  async(req, res)=>{

  let search = req.query.search;

  let user
  if(search){
    if(search === "admin" || search ==="Admin"){
      user = await User.find({admin : true});
    }else{
      user = await User.find({$or:[{email : {$regex: `${search}`, $options: 'i'}},{mainSkill : {$regex: `${search}`, $options: 'i'}}]});
    }
    
    if(user.length === 0) {
      req.flash('error', "No user found")
      user = await User.find();
    }
  }else{
    user = await User.find();
  }
   
                           
   let page =  parseInt(req.query.page) || 1;
    const  result  = Pagination(user, page, 10) 

  res.render('admin/userlist', {
    title: "Users",
    user:req.currentUser,
    users:result,
  })
})

router.get("/administrator/manage", authenticate, admin,  async(req, res)=>{

  let search = req.query.search;

  let user
  if(search){
    if(search === "admin" || search ==="Admin"){
      user = await User.find({admin : true});
    }else{
      user = await User.find({$or:[{email : {$regex: `${search}`, $options: 'i'}},{mainSkill : {$regex: `${search}`, $options: 'i'}}]});
    }
    
    if(user.length === 0) {
      req.flash('error', "No user found")
      user = await User.find();
    }
  }else{
    user = await User.find();
  }
   
                           
   let page =  parseInt(req.query.page) || 1;
    const  result  = Pagination(user, page, 10) 

  res.render('admin/register', {
    title: "Users",
    user:req.currentUser,
    users:result,
  })
})

router.get('/administrator/registerdetail/:id', authenticate, admin, async(req, res)=>{
  const user =await User.findOne({_id: req.params.id});
  res.render('admin/admindetails',{
    user
  })
})

//Deletion for administrator
router.delete('/administrator/:id', authenticate, admin,  async(req, res)=>{
       
  const user = await  User.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!user) return res.status(404).render('admin/register', { 
          title: 'Administrator',
          user: req.currentUser
        });

        req.flash('success', "Admin deleted detail deleted")
        res.location('/administrator/manage');
        res.redirect('/administrator/manage');

})

module.exports = router;
