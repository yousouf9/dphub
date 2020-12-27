const mongoose = require('mongoose');



const subscribeSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    press_release:{
        type: Number
    },
    event:{
        type: Number
    },
    publication:{
        type: Number
    },
    blogs:{
        type: Number
    },
    multimedia:{
        type: Number
    },
    jobs:{
        type: Number
    }


}, {timestamps:true});


const  Subscribe =  mongoose.model('Subscribe', subscribeSchema);

module.exports.Subscribe = Subscribe;