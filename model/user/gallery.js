const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    photo:{
        type: String,
    }

}, {timestamps:true});


const  Gallery =  mongoose.model('Gallery', gallerySchema);

module.exports.Gallery = Gallery;