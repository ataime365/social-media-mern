import "./feed.css"
import Share from "../share/Share"
import Post from "../post/Post"
import { useContext, useEffect, useState } from "react"
// import { Posts } from "../../dummyData"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"

export default function Feed({ username }) {
  const [posts, setPosts] = useState([])

  const { user } = useContext(AuthContext)

  useEffect( ()=>{
    const fetchPosts = async () => {
      // If username, it means i want to get posts for profile page, if not, i just want to get general timeine posts
      const res = username ? await axios.get("/posts/profile/" + username) //fetching Post by username for users timeline
                    : await axios.get("/posts/timeline/" + user._id) //Johns Id
      setPosts(res.data.sort((p1, p2) => { // sorting algorithm
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      })) 
    }
    
    fetchPosts()
  }, [username, user._id])                         // [] means it should only run once, [] is the dependency


  return (
    <div className="feed" >
      <div className="feedWrapper">
        {/* {username===user.username ? <Share /> : ''}  same as below, if username is current user, show share, if not, show nothing */}
        { (!username || username===user.username) && <Share />}
        
        {posts.map( (post) => (
                <Post key={post._id} post ={post}  /> //passing props down
                )    //we have to use key when using map
        ) }

      </div>
    </div>
  )
}
// id: number;
// profilePicture: string;
// username: string;

// id: number;
// desc: string;
// photo: string;
// date: string;
// userId: number;
// like: number;
// comment: number;