// /api/posts
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post("/", async (req, res)=>{
    const newPost = new Post(req.body)
    try {
        const savedPost= await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

// update a post
router.put("/:id", async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id) //Grab the post by post id and check the user id
        if(post.userId === req.body.userId) {
            const updatePost = await post.updateOne({$set: req.body, })
            res.status(200).json("Post has been updated")
        } else {
                res.status(403).json("You can only update your post")
            }
    } catch(err) {
        return res.status(500).json(err)
    }
})

// delete a post
router.delete("/:id", async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id) //Grab the post by post id and check the user id
        if(post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("Post has been deleted")
        } else {
                res.status(403).json("You can only delete your post")
            }
    } catch(err) {
        return res.status(500).json(err)
    }
})

// like a post and dislike
router.put("/:id/like", async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: {likes: req.body.userId } })
            res.status(200).json("This post has been liked")
        } else {
            await post.updateOne({ $pull: {likes: req.body.userId } })
            res.status(200).json("This post has been unliked")
        }
    } catch(err) {
        return res.status(500).json(err)
    }
})

// get a post
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch(err) {
        return res.status(500).json(err)
    }
})

// get feed timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try{
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currentUser._id}) //Finding post by the current user id
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId})  //find the posts where userId is equals to friendsId
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch(err) {
        return res.status(500).json(err)
    }
})


// get User All posts //Only his posts
router.get("/profile/:username", async (req, res) => {
    try{
        const currentUser = await User.findOne({ username: req.params.username } ) //using username not userId
        const userPosts = await Post.find({ userId: currentUser._id}) //Finding post by the current user id.. database _id

        res.status(200).json(userPosts)
    } catch(err) {
        return res.status(500).json(err)
    }
})






module.exports = router;