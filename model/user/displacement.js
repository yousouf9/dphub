const mongoose = require('mongoose');



const displacementSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    yod: {
        value:{ 
            type: String,
            default:""},
        show:{
            type: Boolean,
            default: false
        }
    },
    boko_haram: {
        type: String,
        default:""
    },
    bandit:{
        type: String,
        default:""
    },
    flood: {
        type: String,
        default:""
    },
    communal_crisis:{
        type: String,
        default:""
    },
    other: {
        type: String,
        default:""
    },

    state:{
        type: String,
        default:""
    },
    place_residence:{
        value:{ 
            type: String,
            default:""},
        show:{
            type: Boolean,
            default: false
        }
    }  
}, {timestamps:true});


const  Displacement =  mongoose.model('Displacement', displacementSchema);

module.exports.Displacement = Displacement;