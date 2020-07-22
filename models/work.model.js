const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const workSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }],
    body: {
        type: String,
        required: true
    },
    commentsNum : {
        type: Number,
        default: 0,
    },
    favesNum : {
        type: Number,
        default: 0,
    },
    postedBy: { 
        type: Schema.Types.ObjectId,  
        ref: "User"
    },
    attachedTo: { 
        type: Schema.Types.ObjectId,  
        ref: "Prompt"
    },
}, {timestamps: true})

const Work = mongoose.model("Work", workSchema);

module.exports = Work;