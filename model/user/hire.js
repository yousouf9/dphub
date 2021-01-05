const mongoose = require('mongoose');



const hireSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    name: {
        type: String,
        default:""
    },
    organization: {
        type: String,
        default:""
    },
    state_loc:{
        type: String,
        default:""
    },
    area: {
        type: String,
        default:""
    },
    skill:{
        type: String,
        default:""
    },
    email: {
        type: String,
        default:""
    },

    phone:{
        type: String,
        default:""
    }
    
}, {timestamps:true});


const  Hire =  mongoose.model('Hire', hireSchema);

module.exports.Hire = Hire;