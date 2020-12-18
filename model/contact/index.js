const Joi = require('joi');
const mongoose = require('mongoose');



const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        minlength:5,
        maxlength:100
    },
    subject:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    }

}, {timestamps: true});

const  Contact =  mongoose.model('Contact', contactSchema);

const  validateInput =(userInputs)=>{
    const schema =  Joi.object({
        
        name: Joi.string().min(5).max(100).required(),
        email: Joi.string().email().min(5).max(100).required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        submit: Joi.allow(null)
    }) 


    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
}



module.exports.Contact = Contact;
module.exports.validateInput = validateInput;