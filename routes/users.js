const express = require('express');
const {sendMail} = require('../utility/sendMail')

const { User, validateUser } = require('../model/user/user');
const winston = require('winston');
const config= require('config');

const router = express.Router();

/* GET user Login form */
router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Login' });
});


/* GET user register form */
router.get('/register', function(req, res, next) {
  res.render('user/register', { title: 'Register' });
});


/* GET user personal form */
router.get('/register/1', function(req, res, next) {
  res.render('user/personal', { title: 'Register' });
});

/* GET user displacement form */
router.get('/register/2', function(req, res, next) {
  res.render('user/displacement', { title: 'Register' });
});

/* GET user skills and talent form */
router.get('/register/3', function(req, res, next) {
  res.render('user/skill_talent', { title: 'Register' });
});

/* GET user education form */
router.get('/register/4', function(req, res, next) {
  res.render('user/education', { title: 'Register' });
});

/* GET user language form */
router.get('/register/5', function(req, res, next) {
  res.render('user/language', { title: 'Register' });
});

/* GET user qualification form */
router.get('/register/6', function(req, res, next) {
  res.render('user/qualification', { title: 'Register' });
});

/* GET user uploads form */
router.get('/register/7', function(req, res, next) {
  res.render('user/uploads', { title: 'Register' });
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

/*    let account = new  Account({
    user:{
           id:user._id,
           name:'account'
       }
   }) */
  
    
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

  const emailToken =User.verifyEmailToken(token);

  if(!emailToken) {
    req.flash('error', "Invalid token")
   return res.status(400).render('/')
  }


  let user = null;
  if(mongoose.Types.ObjectId.isValid(emailTokens)){
   user = await User.findById(emailTokens)
  }else{
      throw new Error('Not a valid object ID')
  }
  
  if(!user) {
    req.flash('error', "User account does not exist")
   return res.status(400).render('/')
  }

   user.isVerified = true;
   await user.save();

   

})

module.exports = router;
