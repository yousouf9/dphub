const mongoose = require('mongoose');



const languageSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    language_speaking: {
        type: String,
        default:""
    },
    language_writing: {
        type: String,
        default:""
    },
}, {timestamps:true});


const  Language =  mongoose.model('Language', languageSchema);

module.exports.Language = Language;