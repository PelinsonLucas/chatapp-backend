const express = require('express');
const Messages = require('../models/dbMessages.js');
const jwt = require('jsonwebtoken');
const user = require('../models/dbUsers.js');
const chats = require('../models/dbChats.js');

const router = express.Router();

router.get('/sync', (req, res) => {

    var username = "";

    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    user.findOne({username: username})
    .then((user) => {
        Messages.find({chatid: { $in: user.chats }})
        .then((messages) => res.status(200).send(messages))
        .catch((error) => res.status(500).send(error))
    })
    .catch((error) => { console.log(error)})
    
});

router.get('/get/:messageid', (req, res) => {
    var messageid = req.params.messageid;
    var username = "";

    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    user.findOne({username: username})
    .then((user) => {
        Messages.findOne({_id: messageid})
        .then((message) => {
            if (user.chats.includes(message.chatid))
                res.status(200).send(message);
            else
                res.status(500).send("You are not in this chat");
        })
        .catch((error) => res.status(500).send(error));
    })
    .catch((error) => { console.log(error)})
});

router.post('/new',  (req, res) => {
    const dbMessage = req.body;

    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');

        Messages.create(dbMessage)
        .then((data) => {
            chats.findOne({_id: data.chatid })
            .then((chat) => {
                chat.lastMessageId = data._id;
                chat.save();
            })
            .catch((error) => res.status(500).send(error));
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    }catch(err){
        res.json({status: 'error', message: 'Invalid token'})
        return 0;
    };  
});

module.exports = router;