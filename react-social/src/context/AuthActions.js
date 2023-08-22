
export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START",
})

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user, //when successful the api gives as the user details
})

export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error
})


export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId
})

export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId
})
