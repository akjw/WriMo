const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const promptSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    works: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work"
    }],
    worksNum: {
        type: Number,
        default: 0,
    },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    },
}, {timestamps: true})

const Prompt = mongoose.model("Prompt", promptSchema);

module.exports = Prompt;