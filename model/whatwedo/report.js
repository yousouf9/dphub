

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    total_number: {
        type: Number,
        default:0,
    },
    location: {
        type: String,
        default:""
    },
}, {timestamps:true});


const  ReportCase =  mongoose.model('ReportCase', reportSchema);

module.exports.ReportCase = ReportCase;