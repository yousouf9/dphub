const mongoose = require('mongoose');



const personalSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    sex: {
        value:{ 
            type: String,
            default:""},
        show:{
            type: Boolean,
            default: false
        }
    },
    dob: {
        value:{ 
            type: String,
            default:""},
        show:{
            type: Boolean,
            default: false
        }
    },
    marital_status:{
        value:{ 
            type: String,
            default:""},
        show:{
            type: Boolean,
            default: false
        }
    },
    number_children: {
        type: Number,
        default:0
    },
    state:{
        value:{ 
            type: String,
            default:""},
        show:{
            type: Boolean,
            default: false
        }
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