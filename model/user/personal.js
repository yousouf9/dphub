const mongoose = require('mongoose');



const personalSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    sex: {
        type: String,
        default:""
    },
    dob: {
        type: String,
        default:""
    },
    marital_status:{
        type: String,
        default:""
    },
    number_children: {
        type: Number,
        default:0
    },
    state:{
        type: String,
        default:""
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


const  Personal =  mongoose.model('Personal', personalSchema);

module.exports.Personal = Personal;