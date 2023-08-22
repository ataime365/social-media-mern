const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


// add
router.post("/", async (req,res)=>{
    const newMessage = new Message(req.body); //req.body means send the whole message

    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})


// get messages in a conversation 

router.get("/:conversationId", async (req, res)=>{
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
})





module.exports = router;