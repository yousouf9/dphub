const mongoose = require('mongoose');



const sliderSchema = new mongoose.Schema({

    description: {
        type: String,
        default: ''
    },
    photo:{
        type: String,
    }

}, {timestamps:true});




const  Slider =  mongoose.model('Slider', sliderSchema);


module.exports.Slider = Slider;
