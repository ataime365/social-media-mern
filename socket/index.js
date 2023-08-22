const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000", //we have to put the url to our react app here, so that react accepts it
    },
});

let users_list = []; // [{userId:userId, socketId:socket.id}, {}] //A list of dictionaries

// The function that does the filtering before adding //Array.some(()=>{})
const addUser = (userId, socketId) =>{ //If it is not in the list, then add it
    !users_list.some((u) => u.userId === userId) &&
        users_list.push({userId, socketId})
}

//Function to remove user from list
const removeUser = (socketId) =>{
    users_list = users_list.filter(u => u.socketId !== socketId)
}

const getSpecificUser = (userId) => { // find a user by using the userId
    return users_list.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    // when connect
    console.log("a user connected.")
    //take userId and socketId from user
    socket.on("addUser", userId=>{ //taking the userId sent from the client
        addUser(userId, socket.id)
        io.emit("getUsers", users_list) //Sending the users_list to the frontend from the backend
    })

    // Send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) =>{
        const receiver = getSpecificUser(receiverId) //receiver is a user
        io.to(receiver.socketId).emit("getMessage", {senderId, text})
    })
    
    // when disconnect
    socket.on("disconnect", ()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users_list)
    })
})









