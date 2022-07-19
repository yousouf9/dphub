const mongoose = require('mongoose');



const educationSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    highest_education: {
        type: String,
        default:""
    },
    specialization: {
        type: String,
        default:""
    },
    institution:{
        type: String,
        default:""
    },
    duration: {
        type: Number,
        default:0
    },
    yog:{
        type: Date,
    },
    home_town: {
        type: String,
        default:""
    },

    nationality:{
        type: String,
        default:""
    }
    
}, {timestamps:true});


const  Education =  mongoose.model('Education', educationSchema);

module.exports.Education = Education;