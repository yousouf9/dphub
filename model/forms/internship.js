const mongoose = require('mongoose');



const internSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    whatsapp:{
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    sex:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true
    },
    nationality:{
        type: String,
        required: true
    },
    specialization: {
        type: String
    },
    institution:{
        type: String,
    },
    duration: {
        type: String
    },
    yog:{
        type: String,
    },
    interesArea:{
        human_right:{
            type: String,
        },
        skill:{
            type: String,
        },
        advocacy:{
            type: String,
        },
        wash:{
            type: String,
        },
        dc:{
            type: String,
        },
        hr:{
            type: String,
        },
        policy:{
            type: String,
        },
        me:{
            type: String,
        },
        cr:{
            type: String,
        },
    },
    cv:{
        type: String,
    },
    


}, {timestamps:true});


const  Internship =  mongoose.model('Internship', internSchema);

module.exports.Internship = Internship;