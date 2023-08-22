import { useEffect, useState } from "react";
import "./message.css"
import { format } from 'timeago.js';
import axios from "axios";

export default function Message({ message, own }) { //message (conversationId, sender, text, createdAt)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [senderd, setSenderd] = useState([])

  useEffect(()=>{
    const getUser = async ()=> {
      const res = await axios.get("/users?userId="+ message.sender)
      setSenderd(res.data)
    }
    getUser()
  }, [message])

  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img className="messageImg" 
            src={senderd.profilePicture ? PF+senderd.profilePicture : PF+"person/noAvatar.png"}
             alt="" />
            <p className="messageText">{message.text} </p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
