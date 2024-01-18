const {onRequest} = require("firebase-functions/v2/https");

const express = require('express');
const mongoose = require('mongoose');
const messages = require('./components/controller/messages.js');
const users = require('./components/controller/users.js');
const chats = require('./components/controller/chats.js');
const Pusher = require('pusher');
const cors = require('cors');
const dbChats = require('./components/models/dbChats.js');

const app = express();

const pusher = new Pusher({
    appId: "1722108",
    key: "d2fd8ef24054129ba743",
    secret: "a79e19e6749cf3fcc936",
    cluster: "sa1",
    useTLS: true
  });

const connectURL = "mongodb+srv://admin:zjxEicdc2FQM20TF@cluster0.wuy3nrc.mongodb.net/ChatApp?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);
mongoose.connect(connectURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => {

    console.log("DB connected!");

    const changeStream = db.collection('messagecontents').watch();

    changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            dbChats.findById(messageDetails.chatid)
            .then((chat) => {
                pusher.trigger("messages", "inserted", {
                    users: chat.users,
                    messageid: messageDetails._id,
                });
            })
            .catch( console.log("Error triggering Pusher"));
        }else{
            console.log("Error triggering Pusher");
        }
    });
});

app.use(express.json({ limit: '5mb' }));

app.use(cors());

app.use("/messages", messages);
app.use("/user", users);
app.use("/chats", chats);

app.get("/", (req, res) => res.status(200).send("Hello World!"));

exports.app = onRequest({memory: "512MiB"}, app);