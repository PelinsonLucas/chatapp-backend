const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    username: String,
    chatid: String
});

module.exports = mongoose.model('messagecontents', messageSchema);