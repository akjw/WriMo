const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    onWork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work"
    },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    },
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;