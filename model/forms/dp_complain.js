const mongoose = require('mongoose');
const Joi = require("joi")



const complaintSchema = new mongoose.Schema({

    reporter: {
        type: String,
        required: true
    },
    reporter_name:{
        type: String,
        default:""
    },
    reporter_phone:{
        type: String,
        minlength: 11,
        maxlength: 15
    },
    reporter_email:{
        type: String,
    },
    victim_name:{
        type: String,
        required: true
    },
    victim_sex: {
        type: String,
        required: true,
    },
    victim_age:{
        type: Number,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    victim_camp: {
        type: String,
        required: true
    },
    type_of_abuse: {
        "type": [
          String
        ],
        required: true
    },
    other_complain:{
        "type": [
            String
          ],
          required: true
    },
    victim_date: {
        type: String,
        required: true
        
    },
    victim_description:{
        type: String,
        required: true
    },
    attachment:{
        type: String,
        default: ""
    },
    offender_number:{
        type: String,
        minlength: 11,
        maxlength: 15,
        required: true
    },
    offender_name:{
        type: String,
        default: "",
        required: true
    },
    offender_sex:{
        type:String,
        required: true
    },
    offender_affiliation:{
        type: String,
        required: true
    },
    offender_link_victim:{
        type: String,
        required: true
    },
    offender_description:{
        type: String,
        required: true
    }

}, {timestamps:true});


const  Complaint =  mongoose.model('Complaint', complaintSchema);

const  validateform =(userInputs)=>{
    const schema =  Joi.object({
        
        reporter: Joi.string().required(),
        reporter_name: Joi.string().allow(''),
        reporter_phone: Joi.string().allow('').min(11).max(14),
        reporter_email: Joi.string().allow('').email(),
        victim_name: Joi.string().required(),
        victim_sex: Joi.string().required(),
        victim_age: Joi.number().required(),
        state: Joi.string().required(),
        victim_camp: Joi.string().required(),
        type_of_abuse: Joi.array().required(),
        other_complain: Joi.array().required(),
        victim_date: Joi.string().required(),
        victim_description: Joi.string().required(),
        attachment: Joi.string().allow(''),
        offender_number: Joi.string().min(11).max(14).required(),
        offender_name: Joi.string().required(),
        offender_sex: Joi.string().required(),
        offender_affiliation: Joi.string().required(),
        offender_link_victim: Joi.string().required(),
        offender_description: Joi.string().required(),
    }) 


    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
}

module.exports.Complaint = Complaint;
module.exports.validateComplaintForm = validateform