import { useEffect, useState } from "react";
import "./conversation.css"
import axios from "axios";

export default function Conversation( {conversation, currentUser} ) {
  //conversation is a list of dictionaries  //conversation.member is an array  // list.find(()=>{})
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friend, setFriend] = useState([])

  useEffect( ()=> {
    const friendId = conversation.members.find((m) => m !== currentUser._id); //getting friend Id from the conversation array

    const getUser = async () => {
      try{
          const res = await axios.get("/users?userId="+ friendId)
          setFriend(res.data)
      } catch(err){
        console.log(err)
      }
    }
    getUser()
    // console.log(friend, 'This is friend')
  }, [conversation , currentUser]);


  return (
    <div className="conversation">
        <img className="conversationImg" 
          src={friend.profilePicture ? PF+friend.profilePicture : PF+"person/noAvatar.png"} alt="" />
        <span className="conversationName">{friend.username}</span>
    </div>
  )
}
