
const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload ,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            }
        case "FOLLOW":
            return { //updating the current user state details
                ...state, //state is a dictionart, check INITIAL_STATE in AuthContext.js
                user: {
                    ...state.user, //copying all user details while changing followings only
                    followings: [...state.user.followings, action.payload], //action.payload here is userId from AuthAction.js
                },
            }
        case "UNFOLLOW":
            return { //updating the current user state details
                ...state, //state is a dictionart, check INITIAL_STATE in AuthContext.js
                user: {
                    ...state.user, //copying all user details while changing followings only
                    followings: state.user.followings.filter((f_userId)=>
                        f_userId !== action.payload //takes the rest except this userId
                    ) , //action.payload here is userId from AuthAction.js
                } // if filter statement has {}, then we must use a return statement inside the {}
            }
        default:
            return state
    }
}

export default AuthReducer;












