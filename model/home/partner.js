const mongoose = require('mongoose');



const partnerSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    },
    photo:{
        type: String,
    }

}, {timestamps:true});


const  Partner =  mongoose.model('Partner', partnerSchema);

module.exports.Partner = Partner;