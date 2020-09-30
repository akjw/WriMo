const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const roomSchema = Schema({
    name: String,
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    users: [{ 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    }],
}, {timestamps: true})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;