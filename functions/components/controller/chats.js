const express = require('express');
const jwt = require('jsonwebtoken');
const chats = require('../models/dbChats.js');
const user = require('../models/dbUsers.js');

const router = express.Router();

router.post('/new',  (req, res) => {
    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        var username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    user.find({username: {$in: req.body.users}})
    .then((users) => {
        if (req.body.privateChat && users.length != 2) {
            res.status(201).send("Private chat requires 2 users");
        }else{
            chats.create(req.body)
            .then((data) => {
                for (let currentUser of users){
                    currentUser.chats.push(data._id);
                    currentUser.save();
                }
                res.status(201).send(data);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        }
    })
    .catch((error) => { console.log(error)})

});

router.get('/get/:id',  (req, res) => {
    const id = req.params.id;

    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        var username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    user.findOne({username: username})
    .then((user) => {
        chats.findById(id)
        .then((chat) => {
            if(chat.users.includes(username) && user.chats.includes(id))
                res.status(200).send(chat);
            res.status(500).send("Not in chat");
        })
        .catch((error) => res.status(500).send(error));
    })
    .catch((error) => { console.log(error)})
});

router.get('/sync',  (req, res) => {

    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        var username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    user.findOne({username: username})
    .then((user) => {
        chats.find({_id: { $in: user.chats }})
        .then((chat) => res.status(200).send(chat))
        .catch((error) => res.status(500).send(error))
    })
    .catch((error) => { console.log(error)})
});

router.post('/join',  (req, res) => {
    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        var username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    user.findOne({username: username})
    .then((currentUser) => {
        chats.findOne({ _id: req.body.id })
        .then((chat) => {
            if(chat.privateChat) {
                res.status(500).send("Private chat!");
            } else
            if(chat.users.includes(username) || currentUser.chats.includes(username)){
                res.status(500).send("Already in chat");
            }
            else {
                chat.users.push(username);
                currentUser.chats.push(req.body.id);
                chat.save();
                currentUser.save();
                res.status(201).send(req.body.id);
            }
            
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    })
    .catch((err) => { res.status(500).send(err);})
});

module.exports = router;