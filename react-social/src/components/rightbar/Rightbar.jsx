import "./rightbar.css"
import { Users } from "../../dummyData"
import Online from "../online/Online"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Add, Remove } from "@mui/icons-material"

export default function Rightbar({ user }) {

  const { user:currentUser, dispatch } = useContext(AuthContext) //user is not the same as user
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;  //public folder
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id))
  const [userFollowings, setUserFollowings] = useState([]) //To handle followings

  // const uname = user.username //This had to be outside the useeffect hook

  useEffect( ()=> {
    currentUser.followings.includes(user?._id) && setFollowed(true) //This is what makes the follow and unfollow work properly
  }, [currentUser, user]) //The two variables this useEffect hook is dependent on


  useEffect( ()=>{
    const fetchUserFollowings = async () => {
      try {
        const followersList = await axios.get(`/users/${user?._id}/followings`) //res.data is the list of userId's
        setUserFollowings(followersList.data) //res.data
    } catch(err) {
      console.log(err)
    }
    }
    
    fetchUserFollowings()
  }, [user]) //only put user here, instead of user.username, because it affects the home rightbar
            //No user in Home rightbar


  const handleClick = async() => {
    try{
      if (followed) {
          await axios.put(`/users/${user?._id}/unfollow`, {userId:currentUser._id,}) 
          dispatch( {type:"UNFOLLOW", payload: user._id} )
          setFollowed(!followed) //set it to the opposite after unflowing, so the button can use the new state of followed to change the button 
      } else {
          await axios.put(`/users/${user?._id}/follow`, {userId:currentUser._id,})
          dispatch( {type:"FOLLOW", payload: user._id} )
          setFollowed(!followed) //set it to the opposite after following, so the button can use the new state of followed to change the button 
      }
      // setFollowed(!followed)
    } catch(err){
      console.log(err)
    }
  }
  

  const HomeRightbar = () => {
    return (
      <>
          <div className="birthdayContainer">
            <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
            <span className="birthdayText">
              <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
              </span>
          </div>
          <img className="rightbarAd" src={`${PF}ad.png`} alt="" />
          <h4 className="rightbarTitle">Online Friends</h4>

          <ul className="rightbarFriendsList">
          {Users.map( (user) => (
                <Online key={user.id} user={user}/>
                ))
          }
          </ul>
      </>
    )
  }

                                    // we use it as a component, because it is actually a component
  const ProfileRightbar = () => { //In the main return function, since this is a react html code, we use <  />, 
    return (
      <>
        {/* Logic to see follow button once the user is not same as current user, i.e user is not on his page
        , because you cant follow yourslef */}
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick} >
            {followed ? "Unfollow" : "Follow" }
            
            {followed ? <Remove /> : <Add /> }

          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship===1 ? "Single" : 
              user.relationship===2 ? "Married" : "Complicated" }
            </span>
          </div>
        </div>

        <h4 className="rightbarTitle">User friends</h4>

          <div className="rightbarFollowings">
          {userFollowings.map( (uf) => (
                // console.log(uf)
            <div key={uf._id} className="rightbarFollowing">
              <Link to={`/profile/${uf.username}`} style={{textDecoration:"none"}} >
                <img
                src={uf.profilePicture? PF+uf.profilePicture  :  PF+"person/noAvatar.png"}
                  alt="" className="rightbarFollowingImg" />
              </Link>
              <span className="rightbarFollowingName">{uf.username}</span>
            </div> 
          )    //we have to use key when using map
          )}
          </div>


      </>
    )
  }

  return (
    <div className="rightbar">
        <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}

        </div>
    </div>
  )
}
