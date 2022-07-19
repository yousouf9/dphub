const mongoose = require('mongoose');



const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    show:{
        type: Boolean,
        default:true,
    }

}, {timestamps:true});


const  Event =  mongoose.model('Event', eventSchema);

module.exports.Event = Event;