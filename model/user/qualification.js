const mongoose = require('mongoose');



const qualificationSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    cert_name: {
        type: String,
        default:""
    },
    institution: {
        type: String,
        default:""
    },
    doa:{
        type: Date,
    }
    
}, {timestamps:true});


const  Qualification =  mongoose.model('Qualification', qualificationSchema);

module.exports.Qualification = Qualification;