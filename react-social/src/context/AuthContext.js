import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";


const INITIAL_STATE = {
    // user: null,
    user: JSON.parse(localStorage.getItem("user")) || null, //New
    isFetching: false,  // isFetching determines the beginning and end of the process
    error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children })=> {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
    // New
    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user])

    return (
        <AuthContext.Provider 
        value={{ 
            user: state.user, 
            isFetching: state.isFetching, 
            error: state.error, 
            dispatch }} >

        {children}

        </AuthContext.Provider>
    )
}













// {
//     "_id": "645f7863cbfb713275800d5b",
//     "username": "ataime15",
//     "email": "ataime15@gmail.com",
//     "profilePicture": "person/ataime15.jpeg",
//     "coverPicture": "",
//     "followers": [],
//     "followings": [], // //john .. Ataime is following John
//     "isAdmin": false,
// }






