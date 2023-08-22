const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');


// new conversation //add
router.post("/", async (req,res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation= await newConversation.save()
        res.status(200).json(savedConversation)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get conversation of a user using userId
router.get("/:userId", async (req, res)=>{
    try{
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId]}, //mongo db query syntax for searching Arrays
        })
        res.status(200).json(conversations)
    }catch(err) {
        res.status(500).json(err)
    }
})


// get conversation between 2 userId
router.get("/find/:firstUserId/:secondUserId", async (req, res)=>{
    try{
        const conversations = await Conversation.find({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] }, //mongo db query syntax for searching Arrays
        })
        res.status(200).json(conversations)
    }catch(err) {
        res.status(500).json(err)
    }
})






module.exports = router;