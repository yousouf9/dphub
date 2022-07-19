const mongoose = require('mongoose');



const reportSchema = new mongoose.Schema({

    title: {
        type: String,
       required: true
    },
    photo:{
        type: String,
        required: true
    },
    filename:{
      type: String,
      required: true
    }

}, {timestamps:true});


const  Report =  mongoose.model('Report', reportSchema);

module.exports.Report = Report;