

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        default:""
    },
    category: {
        type: String,
        default:""
    },
    authority:{
        type: String,
        default:""
    },
    date:{
        type:String
    }
    
}, {timestamps:true});


const  Alert =  mongoose.model('Alert', alertSchema);

module.exports.Alert = Alert;