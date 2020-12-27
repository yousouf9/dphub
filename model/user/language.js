const mongoose = require('mongoose');



const langaugeSchema = new mongoose.Schema({

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


const  Langauge =  mongoose.model('Langauge', langaugeSchema);

module.exports.Langauge = Langauge;