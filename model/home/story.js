const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({

    title: {
        type: String,
        default: ''
    },
    description:{
        type: String,
        default: '',
    },
    articleBody:{
        type: String,
        default: '',
    },
    photo:{
        type: String,
    }

}, {timestamps:true});


const  Story =  mongoose.model('Story', storySchema);

module.exports.Story = Story;