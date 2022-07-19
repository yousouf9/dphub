const mongoose = require('mongoose');



const sponsorSchema = new mongoose.Schema({

    name: {
        type: String,
        default:""
    },
    c_person: {
        type: String,
        default:""
    },
    phone:{
        type: String,
        default:""
    },
    email: {
        type: String,
        default:""
    },
    sex:{
        type: String,
        default:""
    },
    address: {
        type: String,
        default:""
    },

    interest:{
        type: String,
        default:""
    }
    
}, {timestamps:true});


const  Sponsor =  mongoose.model('Sponsor', sponsorSchema);

module.exports.Sponsor = Sponsor;