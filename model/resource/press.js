const Joi = require('joi');
const mongoose = require('mongoose');



const pressSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    photo:{
        type: String,
        required: true,
    },
    pressBody:{
        type: String,
        required: true,
    }

}, {timestamps: true});

const  Press =  mongoose.model('Press', pressSchema);

const  validateInput =(userInputs)=>{
    const schema =  Joi.object({
        title: Joi.string().required(),
        photo: Joi.string().required(),
        pressBody: Joi.string().required(),
        submit: Joi.allow(null)
    }) 


    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
}



module.exports.Press = Press;
module.exports.validateInput = validateInput;