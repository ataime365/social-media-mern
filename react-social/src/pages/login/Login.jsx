import "./login.css"
import { useContext, useRef } from "react"
import { loginCall } from "../../apiCalls"
import { AuthContext } from "../../context/AuthContext"
import { CircularProgress } from '@mui/material';

export default function Login() {

  const email = useRef()
  const password = useRef()

  // destructuing of objects
  const {user, isFetching, error, dispatch} = useContext(AuthContext)

  const handleClick = (e) => {
    e.preventDefault() //To stop the page from acting like a default form
    // email.current.value
    loginCall({email: email.current.value, password: password.current.value}, dispatch)
  }
  // console.log(user)

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
                    <input placeholder="Email" required type="email"  className="loginInput" ref={email} />
                    <input 
                    placeholder="Password" required type="password" minLength="6"
                    className="loginInput" ref={password} />
                    <button className="loginButton" disabled={isFetching}>
                      {isFetching ? <CircularProgress size="20px" color="inherit" /> : "Log in"}
                    </button>
                    <span className="loginForgot">Forgot Password?</span>
                    <button className="loginRegisterButton">
                    {isFetching ? <CircularProgress size="20px" color="inherit" /> : "Create a new Account"}
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
