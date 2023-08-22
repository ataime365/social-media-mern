import { useContext, useRef, useState } from "react"
import "./share.css"
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

export default function Share() {

  const { user } = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const desc = useRef() //desc.current.value
  const [file, setFile] = useState(null)

  const handleChange = (e) => {// email.current.value //e is event
    setFile(e.target.files[0]) //get only one file and set it
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const newPost = {
        userId: user._id,
        desc: desc.current.value, 
    };
    if(file){ //just for uploading the file to the backend
        const data = new FormData();
        const fileName = Date.now() + file.name; //adding date string to file name to make it unques
        data.append("name", fileName) // name must always be appended first, the backend will first look for name
        data.append("file", file)
        newPost.img = fileName; //Adding fields to a dictionary newPost['img'] = fileName //python //fileName is file path
        try{
            await axios.post("/upload", data)
        }catch(err) {
            console.log(err)
        }
    }
    try{ //sending to the endpoint db
        await axios.post("/posts", newPost)
        window.location.reload() //for refreshing page
    }catch(err){}
  }

  return (
    <div className="share">
        <div className="shareWrapper">
            <div className="shareTop">
                <img className="shareProfileImg" 
                    src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" />
                <input placeholder={`What's on your mind ${user.username} ?`}
                className="shareInput" ref={desc} />
            </div>
            <hr className="shareHr" />
            {file && (
                <div className="shareImgContainer">
                    <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                    <button onClick={()=>setFile(null)} className="shareCancelBtn">
                    <Cancel className="shareCancel"  />
                    </button>
                </div>
            )}
            <form className="shareBottom" onSubmit={submitHandler} >
                <div className="shareOptions">
                    <label htmlFor="file" className="shareOption">
                        <PermMedia htmlColor="tomato" className="shareIcon" />
                        <span className="shareOptiontext">Photo or Video</span>
                        <input style={{display:"none"}} type="file" id="file" 
                                accept=".png,.jpeg,.jpg" onChange={handleChange} />
                    </label>
                    <div className="shareOption">
                        <Label htmlColor="blue" className="shareIcon" />
                        <span className="shareOptiontext">Tag</span>
                    </div>
                    <div className="shareOption">
                        <Room htmlColor="green" className="shareIcon" />
                        <span className="shareOptiontext">Location</span>
                    </div>
                    <div className="shareOption">
                        <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                        <span className="shareOptiontext">Feelings</span>
                    </div>
                </div>
                <button className="shareButton" type="submit">Share</button>
            </form>
        </div>
    </div>
  )
}
