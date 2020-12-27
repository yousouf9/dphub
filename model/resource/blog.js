const Joi = require('joi');
const mongoose = require('mongoose');



const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    photo:{
        type: String,
        required: true,
    },
    articleBody:{
        type: String,
        required: true,
    },
    url:{
        type: String,
        required: true, 
    },
    comments:[
        
        {  name:{
                type: String, 
                required: true
            },
            commentBody:{
                type: String, 
                required: true 
            },
            email:{
                type: String,
                required: true 
            },
            date:{
                type: Date,
                default: Date.now()
            }
        }
    ]

}, {timestamps: true});

const  Blog =  mongoose.model('Blog', blogSchema);

const  validateInput =(userInputs)=>{
    const schema =  Joi.object({
        title: Joi.string().required(),
        photo: Joi.string().required(),
        articleBody: Joi.string().required(),
        comments:{
            name:Joi.string().required(),
            commentBody:Joi.string().required(),
            email: Joi.string().email().required(),
            commentid: Joi.objectId()
        },
    }) 


    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
}



module.exports.Blog = Blog;
module.exports.validateInput = validateInput;