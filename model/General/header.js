const mongoose = require('mongoose');



const headerSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    },
    photo:{
        type: String,
    }

}, {timestamps:true});


const  Header =  mongoose.model('header', headerSchema);

module.exports.Header = Header;