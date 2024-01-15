const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true }, 
    password: { type: String, unique: true, required: true },
    chats: [String],
    image: String,
});

module.exports = mongoose.model('users', userSchema);