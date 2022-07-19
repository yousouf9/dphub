const mongoose = require('mongoose');


const skillSchema = new mongoose.Schema({

    photo:{
        type: String,
    }

}, {timestamps:true});




const  Skill =  mongoose.model('Skill', skillSchema);


module.exports.Skill = Skill;