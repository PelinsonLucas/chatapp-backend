const express = require('express');
const User = require('../models/dbUsers.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/getimage/:reqUsername', (req, res) => {
    var username = "";

    const reqUsername = req.params.reqUsername;
    
    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    User.findOne({username: reqUsername})
    .then((user) => 
        res.status(200).send({image: user.image})
    )
    .catch((err) => res.status(500).send(err));

});

router.post('/setimage', (req, res) =>{
    const image = req.body.image;

    try{
        const decoded = jwt.verify(req.headers.authorization, '12an31!ksSk1Y7');
        username = decoded.username;
    }catch(err){
        res.status(500).send(err);
        return 0;
    };

    User.findOne({username: username})
    .then((user) => {
        user.image = image;
        user.save();
        res.status(200).send("profile picture updated");
    })
    .catch((err) => res.status(500).send(err));

});

router.post('/register',  (req, res) => {
    const dbUser = req.body;

    bcrypt.hash(dbUser.password, 10)
    .then((hash) => {
        dbUser.password = hash;

        User.create(dbUser)
        .then((data) => {
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    })
    .catch((err) => res.status(500).send(err))
    
});

router.post('/login', (req, res) => {
    const dbUser = req.body;

    User.findOne({username: dbUser.username})
    .then((user) => {
        bcrypt.compare(dbUser.password, user.password)
        .then( (result) => 
        {   
            if(!result) 
                res.status(500).send("Wrong Password");
            else{
                const token = jwt.sign({
                    username : user.username,
                    email: user.email,
                    name: user.name
                }, '12an31!ksSk1Y7');
                res.status(200).send({status: 'ok', user: token});
            }
        })
        .catch( () => err.status(500).send("Wrong Password"))

    })
    .catch((err) => {
        res.status(501).send(err);
    });
    
});

module.exports = router;
