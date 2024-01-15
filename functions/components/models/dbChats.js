const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    name: String,
    created: String,
    image: String,
    lastMessageId: String, 
    privateChat: Boolean,
    users: [String]
});

module.exports = mongoose.model('chats', chatSchema);