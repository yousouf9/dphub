const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT = 10;


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
        required: true,
        minlength: 11,
        maxlength: 16
    },
    whatapp:{
        type: String,
        minlength: 11,
        maxlength: 50
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    profile_image:{
        type: String,
        default: 'noimage.png',
        required: true
    },
    admin:{
        type:Boolean,
        default:false
    },
    isVerified: Boolean,
    token:String,
  
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    step:Number,
    complete: false,

}, {timestamps: true});




const  User =  mongoose.model('User', userSchema);



userSchema.statics.encryptPassword = async (password) => {

    const salt = await bycrypt.genSalt(SALT);
    return   await bycrypt.hash(password, salt)
  
  };


  userSchema.statics.validatePassword =async (password, hash) => {

    return await bycrypt.compare(password, hash);
  
};

userSchema.methods.validateHashed= function(password, hashedPass){
    return bcrypt.compare(password, hashedPass);
}

userSchema.statics.getUserByUsername =  function(email, callback){
    let query = {email: email};
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

const  validateUser =(userInputs)=>{
    const schema =  Joi.object({
        
        name: Joi.string().min(5).max(100).required(),
        email: Joi.string().email().min(5).max(100).required(),
        username: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(5).max(100).required(),
        admin: Joi.boolean(),
        submit: Joi.allow(null)
    }) 


    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
}



module.exports.User = User;
module.exports.validateUser = validateUser;