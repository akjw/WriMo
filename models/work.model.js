const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const workSchema = Schema({
    title: {
        name: String,
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
    postedBy: { 
        type: Schema.Types.ObjectId,  
        ref: "User"
    },
}, {timestamps: true})

const Work = mongoose.model("Work", workSchema);

module.exports = Work;