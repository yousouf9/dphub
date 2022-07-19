const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT = 10;
const config = require('config')


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength:5,
        maxlength:100
    },
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100
    },
    phone:{
        type: String,
    },
    whatapp:{
        type: String,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100
    },
    profile_image:{
        type: String,
        default: 'noimage.png',
        required: true
    },
    about:{
        type:String,
        default: ""
    },
    admin:{
        type:Boolean,
        default:false
    },
    isVerified: Boolean,
    token:String,
    loginToken: String,

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    step:Number,
    complete:{
        type: Boolean,
        default:  false
    },
    mainSkill:{
        type: String,
        default: ""
    },
    social:{
        facebook:{
            type: String,
            default: '',
        },
        twitter:{
            type: String,
            default: '',
        },
        instagram:{
            type: String,
            default: '',
        },
        google:{
            type: String,
            default: '',
        }
    }

}, {timestamps: true});





userSchema.statics.encryptPassword = async (password) => {

    const salt = await bcrypt.genSalt(SALT);
    return   await bcrypt.hash(password, salt)
  
  };


userSchema.statics.validatePassword =async (password, hash) => {

    return await bcrypt.compare(password, hash);
  
};

userSchema.methods.validateHashed= function(password, hashedPass){

    return bcrypt.compare(password, hashedPass);
}

userSchema.statics.getUserByUsername =  function(email, callback){
    let query = {$or:[{email: email}, {username:email}]};
     const user=  User.findOne(query, callback);
     return user
   
};

userSchema.statics.getUserById = async function(id, callback){
  return User.findById(id, callback);
};


userSchema.statics.sendEmailToken = (id) => {

    return tokenCode = jwt.sign({id:id}, config.get('jwtPrivate')); 
};

userSchema.statics.verifyEmailToken = (emailToken) => {
  
      return emailToken = jwt.verify(emailToken, config.get('jwtPrivate')); 
};

userSchema.statics.findByToken = (token) =>{
    //Please un-hash the jwt token 
   return jwt.verify(token, config.get('jwtPrivate'))
}

userSchema.methods.deleteToken = async (token) =>{
      let user = this;
  return await user.User.findOneAndUpdate({loginToken:token},{$unset:{loginToken: 1}},{new: true, useFindAndModify: false})
    
}

const  User =  mongoose.model('User', userSchema);

const  validateUser =(userInputs)=>{
    const schema =  Joi.object({
        
        name: Joi.string().min(5).max(100).required(),
        email: Joi.string().email().min(5).max(100).required(),
        username: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(6).max(100).required(),
        admin: Joi.boolean(),
        submit: Joi.allow(null)
    }) 


    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
}

module.exports.User = User;
module.exports.validateUser = validateUser;