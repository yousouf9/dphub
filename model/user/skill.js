const mongoose = require('mongoose');



const Skill_TalentSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    skill: {
        type: String,
        default:""
    },
    yoe: {
        type: Number,
        default:0
    },
    name_company:{
        type: String,
        default:""
    },
    job_title: {
        type: Number,
        default:0
    },
    country:{
        type: String,
        default:""
    },
    start: {
        type: Date,
    },

    end:{
        type:Date
    },
    contract_type:{
        type: String,
        default:""
    }
    
}, {timestamps:true});


const  Skill_Talent =  mongoose.model('Talent', Skill_TalentSchema);

module.exports.Skill_Talent = Skill_Talent;