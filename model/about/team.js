const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    },
    surname:{
        type: String,
        default: '',
    },
    position:{
        type: String,
        default: '',
    },
    body:{
        type: String,
        default: '',
    },
    photo:{
        type: String,
    },
    social:{
        facebook:{
            type: String,
            default: '',
        },
        twitter:{
            type: String,
            default: '',
        },
        instagram:{
            type: String,
            default: '',
        },
        google:{
            type: String,
            default: '',
        },
        linkin:{
            type: String,
            default: '',
        },
        whatsapp:{
            type: String,
            default: '',
        },
    }

}, {timestamps:true});


const  Team =  mongoose.model('Team', teamSchema);

module.exports.Team = Team;