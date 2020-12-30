const express = require('express');
const {sendMail} = require('../utility/sendMail')

const { User, validateUser } = require('../model/user/user');
const {Personal} = require('../model/user/personal');
const {Displacement} = require('../model/user/displacement');
const {Skill_Talent} = require('../model/user/skill');
const {Education} = require('../model/user/education');
const {Language} = require('../model/user/language');
const {Qualification} = require('../model/user/qualification');
const {Upload} = require('../model/user/uploads');
const multer = require('multer');
const upload_report_file = multer({dest : 'public/images/users/upload'});

const authenticate = require('../middleware/athenticate');
const admin = require('../middleware/admin');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const winston = require('winston');
const config= require('config');
const Fawn = require('fawn');
const mongoose = require('mongoose');

const router = express.Router();

  Fawn.init(mongoose);

/* GET user Login form */
router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Login' });
});


/* GET user register form */
router.get('/register', function(req, res, next) {
  res.render('user/register', { title: 'Register' });
});


/* GET user personal form */
router.get('/register/1', authenticate,async function(req, res, next) {
  const personal = await  Personal.findOne({user:req.currentUser._id}); 

  if(!personal){
     console.log("Personal info not available");
    return res.status(404).render('user/personal', {
      title: 'Register',
     data: req.body
   })
  }

  res.render('user/personal', { 
    title: 'Register',
    personal
  
  });
});

/* Post user personal form */
router.post('/register/1', authenticate, async(req, res)=>{

  let step = req.currentUser.step;
  let personal= null;
  if(step >= 1){

    personal = await Personal.findOneAndUpdate({user:req.currentUser._id}, {
        $set:{
          ...req.body,
     }
      }, {new: true, useFindAndModify: false})
  }else{
    personal = await Personal.findOneAndUpdate({user:req.currentUser._id}, {
      $set:{
        ...req.body,
    }
  }, {new: true,useFindAndModify: false})
     await User.findOneAndUpdate({_id:req.currentUser._id}, {
        $set:{
      step: 1
 }}) 
  }
   
  req.flash('success', "Personal Information updated")
  res.location('/user/register/2');
  res.redirect('/user/register/2');

})

/* GET user displacement form */
router.get('/register/2', authenticate, async function(req, res, next) {

  const displacement = await  Displacement.findOne({user:req.currentUser._id}); 

 if(!displacement){
   return res.status(404).render('user/displacement', {
     title: 'Register',
    data: req.body
  })
 }

  res.render('user/displacement', { title: 'Register', displacement });
});
/* Post user personal form */

router.post('/register/2', authenticate, async(req, res)=>{

  let step = req.currentUser.step;
  let displacement= null;
  if(step >= 2){

    displacement = await Displacement.findOneAndUpdate({user:req.currentUser._id}, {
        $set:{
          ...req.body,
     }
      }, {new: true, useFindAndModify: false})
  }else{
    displacement = await Displacement.findOneAndUpdate({user:req.currentUser._id}, {
      $set:{
        ...req.body,
    }
  }, {new: true,useFindAndModify: false})
     await User.findOneAndUpdate({_id:req.currentUser._id}, {
        $set:{
      step: 2
 }}) 
  }
   
  req.flash('success', "Displacement Information updated")
  res.location('/user/register/3');
  res.redirect('/user/register/3');

})
/* GET user skills and talent form */
router.get('/register/3', authenticate, async function(req, res, next) {
  const talent = await  Skill_Talent.find({user:req.currentUser._id}); 

  if(!talent){
    return res.status(404).render('user/skill_talent', {
      title: 'Register',
   })
  }

  res.render('user/skill_talent', { title: 'Register', talents: talent});
});


//Posting to Skills
router.post('/register/3', authenticate, async(req, res)=>{

  let step = req.currentUser.step;

 
  const talent = new Skill_Talent(req.body);
        talent.user = req.currentUser._id;

        if(step < 3){
          await User.findOneAndUpdate({_id:req.currentUser._id}, {
            $set:{
               step: 3
            }}) 
        }

    const result =   await talent.save();
    if(!result){
      req.flash('error', "Failed to save Skills")
      res.render('user/skill_talent', { title: 'Register', talents: talent});
    }

   
  req.flash('success', "New Skill Added")
  res.location('/user/register/3');
  res.redirect('/user/register/3');

})

//Deletion for skills/talent
router.delete('/skill/:id', async(req, res)=>{

const skill = await  Skill_Talent.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
      if(!skill) return res.status(404).render('user/skill_talent')

      req.flash('success', "Skill Deleted")
      res.location('/user/register/3');
      res.redirect('/user/register/3');
})
/* GET user education form */
router.get('/register/4', authenticate, async function(req, res, next) {
  const education = await  Education.find({user:req.currentUser._id}); 

  if(!education){
    return res.status(404).render('user/education', {
      title: 'Register',
   })
  }
  res.render('user/education', { title: 'Register', educations: education });
});

router.post('/register/4', authenticate, async(req, res)=>{

  let step = req.currentUser.step;

 
  const education = new Education(req.body);
        education.user = req.currentUser._id;

        if(step < 4){
          await User.findOneAndUpdate({_id:req.currentUser._id}, {
            $set:{
               step: 4
            }}) 
        }

    const result =   await education.save();
    if(!result){
      req.flash('error', "Failed to save education")
      res.render('user/education', { title: 'Register', educations: education});
    }

   
  req.flash('success', "New Education added")
  res.location('/user/register/4');
  res.redirect('/user/register/4');

})

//Deletion for education
router.delete('/education/:id', async(req, res)=>{

  const education = await  Education.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!education) return res.status(404).render('user/education')
  
        req.flash('success', "Education Deleted")
        res.location('/user/register/4');
        res.redirect('/user/register/4');
  })
/* GET user language form */
router.get('/register/5', authenticate, async function(req, res, next) {

  const language = await  Language.find({user:req.currentUser._id}); 
  if(!language){
    return res.status(404).render('user/language', {
      title: 'Register',
   })
  }
  res.render('user/language', { title: 'Register', languages:language });
});

//Post Language
router.post('/register/5', authenticate, async(req, res)=>{

  let step = req.currentUser.step;

 
  const language = new Language(req.body);
      language.user = req.currentUser._id;

        if(step < 5){
          await User.findOneAndUpdate({_id:req.currentUser._id}, {
            $set:{
               step: 5
            }}) 
        }

    const result =   await language.save();
    if(!result){
      req.flash('error', "Failed to save language")
      res.render('user/language', { title: 'Register', languages: language});
    }

   
  req.flash('success', "New Language Added")
  res.location('/user/register/5');
  res.redirect('/user/register/5');

})

//Deletion for language
router.delete('/language/:id', async(req, res)=>{

  const language = await  Language.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!language) return res.status(404).render('user/language')
  
        req.flash('success', "Language Deleted")
        res.location('/user/register/5');
        res.redirect('/user/register/5');
  })

/* GET user qualification form */
router.get('/register/6', authenticate, async function(req, res, next) {
  const qualification = await  Qualification.find({user:req.currentUser._id}); 
  if(!qualification){
    return res.status(404).render('user/qualification', {
      title: 'Register',
   })
  }
  res.render('user/qualification', { title: 'Register', qualifications: qualification });
});

router.post('/register/6', authenticate, async(req, res)=>{

  let step = req.currentUser.step;

 
  const qualification = new Qualification(req.body);
      qualification.user = req.currentUser._id;

        if(step < 6){
          await User.findOneAndUpdate({_id:req.currentUser._id}, {
            $set:{
               step: 6
            }}) 
        }

    const result =   await qualification.save();
    if(!result){
      req.flash('error', "Failed to save Qualification")
      res.render('user/qualification', { title: 'Register', qualifications: qualification});
    }

   
  req.flash('success', "New Qualification Added")
  res.location('/user/register/6');
  res.redirect('/user/register/6');

})

//Deletion for Qualification
router.delete('/qualification/:id', async(req, res)=>{
  const qualification = await  Qualification.findOneAndRemove({_id: req.params.id},{new:true,useFindAndModify:false});
        if(!qualification) return res.status(404).render('user/qualification')
  
        req.flash('success', "Qualification Deleted")
        res.location('/user/register/6');
        res.redirect('/user/register/6');
  })
/* GET user uploads form */
router.get('/register/7', authenticate, async function(req, res, next) {

  const upload = await  Upload.findOne({user:req.currentUser._id}); 

  if(!upload){
     console.log("Personal info not available");
    return res.status(404).render('user/personal', {
      title: 'Register',
     data: req.body
   })
  }

  res.render('user/uploads', { title: 'Register', upload });
});


router.post('/register/7', authenticate,  upload_report_file.fields([{name:'cv', maxCount: 1},{name:'other', maxCount: 1}]), async(req, res, next)=>{
  

  let  cv, other
  if(req.files){
    
  
    cv                = req.files.cv ? req.files.cv[0].filename : "";
    other             = req.files.other ? req.files.other[0].filename : "";


  }else{
   console.log('Not uploading file...');
  }


    //setting the name of the image
    req.body.cv = `${req.protocol}://${req.headers.host}/images/users/upload/${cv}`;
    req.body.other = `${req.protocol}://${req.headers.host}/images/users/upload/${other}`; 
 

    let step = req.currentUser.step;
    let upload= null;

    if(step == 6){
  
      upload = await Upload.findOneAndUpdate({user:req.currentUser._id}, {
          $set:{
            ...req.body,
       }
        }, {new: true, useFindAndModify: false})

        await User.findOneAndUpdate({_id:req.currentUser._id}, {
          $set:{
        step: 7,
        complete: true
     }})
    }else{
       req.flash("info", "Uncompleted Form, Please fill out the required fields")
       res.location(`/user/register/${req.currentUser.step}`)
       res.redirect(`/user/register/${req.currentUser.step}`)
    }
     
    req.flash('success', "Registration completed")
    res.location('/user/dashboard');
    res.redirect('/user/dashboard');
  


})

/* GET USER DASHBOARD */
router.get('/dashboard', authenticate,  async function(req, res, next) {

  const user = await User.findOne({_id: req.currentUser._id})
   console.log(user);
    if(!user) {
        req.flash('error', "Please login first")
      return res.status(400).render('/user/login', {
      })
    }

  res.render('user/dashboard', { title: 'Dashboard', user });
});


router.get('/verify_email', function(req, res, next) {
  res.render('forgotpassword', { title: 'verify email' });
});

router.get('/change_password', function(req, res, next) {
  res.render('resetPassword', { title: 'reset' });
});

router.get('/email_verification_message', function(req, res, next) {
  res.render('email-html', { title: 'Email Verify Message' });
});


/** Register a new user */
router.post('/register', async (req, res)=>{

    const {error}  = validateUser(req.body);
    
    if(typeof error !== 'undefined'){
       
       req.flash('error', error.message())
       res.status(400).render('user/register', {
        data: req.body
      })

    }

    const isEmailAvailable =await User.findOne({email: req.body.email});
    const usernameAvailable =await User.findOne({username: req.body.username});
    
    if(isEmailAvailable){
       req.flash('error', "User with email already exist!")
      return res.status(400).render('user/register', {
       data: req.body
     })
    }

    if(usernameAvailable){
      req.flash('error', "Username already exist!")
      res.status(400).render('user/register', {
      data: req.body
    })
   }


   const user = new User(req.body);

   if(!user) {
        req.flash('error', "Failed to create user")
       return res.status(400).render('user/register', {
        data: req.body
      })
    }

  
    
   const verificationToken = await User.sendEmailToken(user._id);
     //update user account verification token  
     //hash user password  
     user.token= verificationToken;
     user.password =await User.encryptPassword(user.password);



   const mailto = `${req.protocol}://${req.headers.host}/user/verify-me/${verificationToken}`;
   const message = `<div>
                        <h2>Welcome to DPHUB</h2>
                        <p>In order to continue your registration please confirm your email below</p>
                        <a href=${mailto}>Verify me</a>
                        <p>Verification link: ${mailto}</p>
                    </div>`

    
   sendMail("info@dphubng.org", user.email, 'Email verification', message,  async function(error, info){
   

    {


          if(error) {
            console.log(error);
            winston.error(error.message, error);
            req.flash('error', error.message)
          return  res.status(400).render('user/register', {
            data: req.body
          })
  

        } else {
          let result = await user.save();

          if(!result) {
               req.flash('error', "Failed to create user")
            return   res.status(400).render('user/register', {
               data: req.body
             })
           }
      
           req.flash('success', "Account Successfully created")
           res.location('/user/email_verification_message');
           res.redirect('/user/email_verification_message');

        }
      }

   }); 
   
})


//Verify email
router.get('/verify-me/:token', async (req, res)=>{

  let token = req.params.token;

  const emailToken = await User.verifyEmailToken(token);

  if(!emailToken) {
    req.flash('error', "Invalid token")
   return res.status(400).render('/')
  }

  let user = null;
  if(mongoose.Types.ObjectId.isValid(emailToken.id)){
   user = await User.findById(emailToken.id)
  }else{
      throw new Error('Not a valid object ID')
  }
   
  

  if(!user) {
    req.flash('error', "User account does not exist")
   return res.status(400).render('/')
  }



      let personal = new Personal({
        user: user._id
      })
      let displacement = new Displacement({
        user: user._id
      })
      
      let skill = new Skill_Talent({
        user: user._id
      })
      
      let education = new Education({
        user: user._id
      })

      
      let language = new Language({
        user: user._id
      })
      
      let qualification = new Qualification({
        user: user._id
      })
      
      let upload = new Upload({
        user: user._id
      })

      let task = Fawn.Task();

      task.update("users", {_id:user._id}, {isVerified : true, step: 1})
          .save("personals", personal)
          .save("talents", skill)
          .save("displacements",displacement)
          .save("educations",education)
          .save("languages",language)
          .save("qualifictions",qualification)
          .save("uploads",upload)
          .run()
          .then((results)=>{

            req.flash('success', "Please Login and complete your registration")
            res.location('/user/login');
            res.redirect('/user/login');
      })
      .catch((err)=>{
        console.log(err);
      })

   

})




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
          

          const isValid =  await User.validatePassword(password, user.password)
          if(!isValid){
              console.log('Password did not matched')
              return done(null, false);
          } 

          return done(null, user);

       });
    }

));

router.post('/login',
 passport.authenticate('local', {failureRedirect:'/user/login', failureFlash:'invalid username or password'}),

 async(req, res)=>{

  const loginToken = await User.sendEmailToken(req.user._id);
    //update user account verification token  
    //hash user password  
   const user = await User.findById(req.user._id); 
   user.loginToken= loginToken;
    await user.save();


  req.flash('success','you are logged in');
  res.cookie('x-auth',  loginToken);

  if(req.user.complete){
    res.location(`/user/dashboard`)
    res.redirect(`/user/dashboard`)
  }else{
    res.location(`/user/register/${req.user.step}`)
    res.redirect(`/user/register/${req.user.step}`)
  }
  
})




router.get('/logout', authenticate,  async (req, res) =>{

  req.logout();

  const result = await req.currentUser.deleteToken(req.token);
  if(!result) return res.status(400).send('Failed to logout')

  
  req.flash('success', 'You have successfully logged out');
  res.redirect('/user/login');

});


const processReg = (step, req, res) =>{
  switch(step){
    case 1:
      break;
    default:
      console.log("not a valid registration");
  }
}

module.exports = router;
