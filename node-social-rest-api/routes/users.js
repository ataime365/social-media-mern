// /api/users
const express = require('express');
const router = express.Router();
const User = require("../models/User"); //using the name to import the schema
const bcrypt = require('bcrypt');

// update user
router.put("/:id", async(req, res)=>{
    if(req.body.userId=== req.params.id || req.body.isAdmin){ //To be sure it is the same user
        if(req.body.password) { // If user tries to update password by sending the password field
            try {
                const salt = await bcrypt.genSalt(10); //bcrypt is an asychronous method
                // This line updates it, .. hashing the password before storing it
                req.body.password = await bcrypt.hash(req.body.password, salt) // req.body.password is the new password
            } catch(err) {
                return res.status(500).json(err)
            }
        }
        // updating the actual user body
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body, })
            res.status(200).json("Account has been updated")
        } catch(err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
})


// delete user
router.delete("/:id", async(req, res)=>{
    if(req.body.userId=== req.params.id || req.body.isAdmin){ //To be sure it is the same user

        // updating the actual user body
        try{ 
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch(err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
})

// localhost/users?userId=23457748 or localhost/users?username=john //query  ? here means query
//  / == /users  here
// get a user by query ==  userId or username
router.get('/', async (req, res)=> {
    const userId = req.query.userId //no longer req.params.userId
    const username = req.query.username
    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username:username})
        const {password, updatedAt, ...others} = user._doc
        res.status(200).json(others)
    } catch(err) {
        return res.status(500).json(err)
    }
    
})

// get a user by id //This is still very needed
// router.get('/:id', async (req, res)=> {
//     if(req.params.id) {
//         try{
//             const user = await User.findById(req.params.id)
//             const {password, updatedAt, ...others} = user._doc
//             res.status(200).json(others)
//         } catch(err) {
//             return res.status(500).json(err)
//         }
//     } else {
//         return res.status(403).json("User not found")
//     }
// })


// follow a user
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId !== req.params.id) { //if current //you cant follow yourself
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId) // currentUser is Me
            if(!user.followers.includes(req.body.userId)) { //The person i am trying to follow, doesnt already have my usedId stored in his followers array
                //We push updates here
                await user.updateOne({$push: {followers: req.body.userId} }) //updating followers Array list with the userId
                await currentUser.updateOne({$push: {followings: req.params.id} })
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you already follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
            }
    } else {
        res.status(403).json("you cant follow yourself")
    }
})


// unfollow a user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId !== req.params.id) { //if current
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId) // currentUser is Me
            if(user.followers.includes(req.body.userId)) {
                //We push updates here
                await user.updateOne({$pull: {followers: req.body.userId} })
                await currentUser.updateOne({$pull: {followings: req.params.id} })
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("you dont follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
            }
    } else {
        res.status(403).json("you cant unfollow yourself")
    }
})

//get friends
// Get a user followings
router.get("/:userId/followings", async (req, res)=>{
    try {
        // const user = await User.findOne({username:req.params.username})
        const user = await User.findById(req.params.userId)
        const userFollowings = user.followings //This gives array of all users Id this user is following
        // Using the uid to find the users
        const userFollowingsList = await Promise.all(
            userFollowings.map((uid) => {
                return User.findById(uid) //{ _id: uid} //or use findbyId //find the posts where userId is equals to friendsId
            })
        )

        //selecting only what we need //destructuring
        let followingsList = []
        userFollowingsList.map( (user) => {
            const {username, profilePicture, _id} = user  
            followingsList.push({username, profilePicture, _id})
        })
        
        res.status(200).json(followingsList) 
        
    } catch (err) {
        res.status(500).json(err)
        }
})



module.exports = router;

