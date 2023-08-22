import { useContext, useEffect, useRef, useState } from "react"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import Topbar from "../../components/topbar/Topbar"
import "./messenger.css"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import {io} from "socket.io-client"

export default function Messenger() {

  const [conversations, setConversations] = useState([]) //An empty list
  const { user } = useContext(AuthContext)
  const [currentChat, setCurrentChat] = useState(null) //This is just to check if we are currently on a chat, no default chats
  const [messages, setMessages] = useState([]) //use [] instead of null //loading previous messages

  const [newMessageString, setNewMessageString] = useState("")
  const scrollRef = useRef()
  const socket = useRef()
  const [arrivalMessage, setArrivalMessage] = useState(null) //arrivalMessage is message arriving from the socket
  const [onlineUsers, setOnlineUsers] = useState([])
  //const [socket, setSocket] = useState(null)

  useEffect(()=>{
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (data)=>{ //data is {senderId, text} from socket
        setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
        })
    })
  }, [])

  useEffect(()=>{ //controls // we are making sure the currentChat has the arrivalMessage.senderId, so the messages go to the right people
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev)=> [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat])

  useEffect(()=>{ //sending the user id to the backend socket to be saved along side socket id
    socket.current.emit("addUser", user._id)
    socket.current.on("getUsers", users_list=>{
        setOnlineUsers(
            user.followings.filter(
                f => users_list.some(u=> u.userId === f)
            )
        ) //A list of all users connected to the socket
    })
  }, [user])

  useEffect(()=>{
    const getConversations = async ()=>{
        try{
            const res = await axios.get(`/conversations/${user._id}`)
            setConversations(res.data)
        } catch(err){
            console.log(err)
        }
    }
    getConversations()
  }, [user])
//   console.log(conversations)
//   console.log(currentChat, 'This is current chat') //currenctChat has conversationId and membersArray

  useEffect(()=>{
    const getMessages = async ()=>{//This will fetch the messages of the current conversation that was clicked //currentChat._id is the conversationId , c._id
        // fetches the messages that has this conversationId
        try{
            const res = await axios.get("/messages/"+ currentChat?._id)
            setMessages(res.data)
        } catch(err){
            console.log(err)
        }
    };
    getMessages()
  }, [currentChat])


  const handleSubmit = async (e)=>{
    e.preventDefault() //To stop it from refreshing the page when the send button is clicked
    const message ={
        conversationId: currentChat._id ,
        sender: user._id,
        text: newMessageString,
    }
    console.log(currentChat, 'currentChat from handlesubmit')
    console.log(currentChat.members, 'currentChat.members')
    const receiverId = currentChat.members.find(member => member !== user._id)

    socket.current.emit("sendMessage", {
        senderId:user._id, receiverId:receiverId , text:newMessageString
    })

    try{
        const res = await axios.post("/messages", message)
        setMessages([...messages, res.data]) //Update the messages, so it shows instantly //A list of dictionaries
        setNewMessageString("") //to clear the textarea after submiting
    }catch(err){
        console.log(err)
    }
  }


  useEffect(()=>{ //Use useEffect here and not inside handle Submit, so it is not only when we add a new message that it will scroll
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  return (
    <>
    <Topbar />
    <div className="messenger">
        <div className="chatMenu"> 
            <div className="chatMenuWrapper">
                <input placeholder="Search for friends" className="chatMenuInput" />
                {conversations.map((c)=> (
                    <div onClick={()=>{setCurrentChat(c)}}>
                        <Conversation key={c._id} conversation={c} currentUser={user} />
                    </div>
                ))}
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">

                {currentChat ?
                (<> 
                    <div className="chatBoxTop">
                        {messages.map(m=>(
                            <div ref={scrollRef}>
                                <Message message={m} own={m.sender===user._id ? true : false} />
                            </div>
                        ))}

                    </div>
                    <div className="chatBoxBottom">
                        <textarea className="chatMessageInput" placeholder="write something...."
                           onChange={(e)=>setNewMessageString(e.target.value)}
                           value={newMessageString} ></textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                    </div> 
                </>) 
                : 
                (<span className="noConversationText">Open a conversation to start a chat</span>) }

            </div>
        </div> 
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat}/>

            </div>
        </div>
    </div>
    </>
  )
}

