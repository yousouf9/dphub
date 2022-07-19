const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    }

}, {timestamps:true});


const  Engagement =  mongoose.model('Engagement', engagementSchema);

module.exports.Engagement = Engagement;