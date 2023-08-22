import "./post.css";
import { MoreVert } from "@mui/icons-material";
// import { Users } from "../../dummyData"
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from 'timeago.js';
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";

export default function Post( { post } ) { //This post, comes from Feed, which is from the database

    const [like, setLike] = useState(post.likes.length) // like === post.like //default
    const [isLiked, setIsLiked] = useState(false) //because we havent liked any post yet //default

    const [user, setUser] = useState({}) //user is a dictionary
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;  //public folder
    const { user:currentUser } = useContext(AuthContext) //user:currentUser //Alias


    // Arrow function as a variable
    const likeHandler = () => {
        try{ //only the current logged in user can like a post
            axios.put("/posts/"+post._id+"/like", {userId: currentUser._id})
        }catch(err){

        }
        setLike(isLiked ? like-1 : like+1) //if we already liked it i.e isliked is True, then minus the like,because button is clicked on
        setIsLiked(!isLiked) // set isLiked to the opposite
    }
                                
    // const user = Users.filter(user => user.id === post?.userId)[0]; //find user where user.id is equal to post.userId //returns a list

    useEffect( ()=>{
      const fetchUser = async () => {
        const res = await axios.get(`/users?userId=${post.userId}`)
        setUser(res.data)
      }
      
      fetchUser()
    }, [post.userId])   


    return (
    <div className="post">
        <div className="postWrapper"> 
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`} style={{textDecoration:"none"}} >
                    <img className="postProfileImg" 
                        src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" />
                    </Link>
                    <span className="postUsername">{user?.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                    <MoreVert />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{post?.desc}</span>
                <img className="postImg" src={PF + post.img} alt="" />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img className="likeIcon" src={`${PF}like.png`} alt="" onClick={likeHandler} />
                    <img className="likeIcon" src={`${PF}heart.png`} alt="" onClick={likeHandler} />
                    <span className="postLikeCounter">{like} {like > 1 ? "people": "person"} liked it</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">
                        {post.comment} {post.comment > 1 ? "comments": "comment"}
                    </span>
                </div>
            </div>
        </div>
    </div>
    )
}
