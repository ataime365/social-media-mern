import "./register.css"
import { useRef } from "react"
import axios from "axios"
// import { useHistory } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function Register() {

  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()

  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault() //To stop the page from acting like a default form
    // email.current.value
    if (passwordAgain.current.value !== password.current.value){ //The ref above is updated by below input values //ref persist the values for us
        passwordAgain.current.setCustomValidity("Passwords don't match!") //ref also gives us added functionality
    } else{
        const user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value
        }
        try {
            await axios.post("/auth/register", user) //user is the body.. req.body.username..
            navigate('/login') //if successful navigate to login page
        } catch(err){
            console.log(err)
        }
    }
  }

  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Bensocial</h3>
                <span className="loginDesc">
                    Connect with friends and the world around you on Bensocial.
                </span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}>
                    <input placeholder="Username" required className="loginInput" ref={username} />
                    <input placeholder="Email" type="email" required className="loginInput" ref={email} />
                    <input placeholder="Password" type="password" required className="loginInput" ref={password} minLength="6" />
                    <input placeholder="Password Again" type="password" required className="loginInput" ref={passwordAgain} />
                    <button className="loginButton" type="submit">Sign up</button>
                    <button className="loginRegisterButton">
                        Log into your Account
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
