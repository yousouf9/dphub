

const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
    case: {
        type: String,
        default:"",
    },
    category: {
        type: String,
        default:""
    },
    community:{
        type: String,
        default:""
    },
    state:{
        type: String,
        default:""
    },
    source:{
        type: String,
        default:""
    },
    date:{
        type: Date,
        required: true
    }
    
}, {timestamps:true});


const  Monitor =  mongoose.model('Monitor', monitorSchema);

module.exports.Monitor = Monitor;