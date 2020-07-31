const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    from: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    },
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;