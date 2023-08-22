import { useState, useEffect } from "react";
import "./chatOnline.css"
import axios from "axios";

export default function ChatOnline({onlineUsers, currentId ,setCurrentChat}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])

  useEffect(()=>{
    const getFriends = async () => {
      try {
        const res = await axios.get(`/users/${currentId}/followings`) //currentId is userId
        setFriends(res.data)
      }catch(err){
        console.log(err)
      }
    }
    getFriends()
  }, [currentId])


  useEffect(()=>{
    setOnlineFriends(friends.filter((f)=> onlineUsers.includes(f._id)))
  }, [friends, onlineUsers])
  // console.log(onlineUsers, 'This is onlinefriends')

  const handleClick = async (o) =>{ // o is the online user we just clicked on
    try{
      const res = await axios.get(`/conversations/find/${currentId}/${o._id}`)
      console.log(res.data, 'This is res.data')
      setCurrentChat(res.data)
    }catch(err){
      console.log(err)
    }
  }

  return (

    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={()=>{handleClick(o)}}>
            <div className="chatOnlineImgContainer">
                <img className="chatOnlineImg" 
                src={o.profilePicture ? PF+o.profilePicture : PF+"person/noAvatar.png"} alt="" />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}

    </div>

  )
}
