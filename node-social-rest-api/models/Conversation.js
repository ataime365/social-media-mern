const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members : {type:Array,  },
},  //A dictionary
{timestamps: true}
)


module.exports = mongoose.model("Conversation", ConversationSchema); //name, schema