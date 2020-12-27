const mongoose = require('mongoose');


const uploadSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    comment: {
        type: String,
        default:""
    },
    source: {
        type: String,
        default:""
    },
    cv:{
        type: String,
        default:""
    },
    other:{
        type: String,
        default:""
    }
    
}, {timestamps:true});

const  Upload =  mongoose.model('Upload', uploadSchema);

module.exports.Upload = Upload;