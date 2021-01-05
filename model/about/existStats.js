const mongoose = require('mongoose');

const displaceStatSchema = new mongoose.Schema({

    skilled_talent: {
        type: String,
        default: ''
    },
    skilled_talent_displaced:{
        type: String,
        default: '',
    },
    training_person:{
        type: String,
        default: '',
    },
    displaced_adult:{
        type: String,
        default: '',
    },
    displaced_adult_benefit:{
        type: String,
        default: '',
    },
    displaced_person_talent:{
        type: String,
        default: '',
    },
    forced_displaced:{
        type: String,
        default: '',
    }

}, {timestamps:true});


const DisplaceStat  =  mongoose.model('DisplaceStat', displaceStatSchema);

module.exports.DisplaceStat = DisplaceStat;