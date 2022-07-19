const mongoose = require('mongoose');



const subscribeSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    press_release:{
        type: String
    },
    event:{
        type: String
    },
    publication:{
        type: String
    },
    blogs:{
        type: String
    },
    multimedia:{
        type: String
    },
    jobs:{
        type: String
    }


}, {timestamps:true});


const  Subscribe =  mongoose.model('Subscribe', subscribeSchema);

module.exports.Subscribe = Subscribe;