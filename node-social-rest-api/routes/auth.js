// /api/auth
const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');


// Register //Handling the post request
router.post('/register', async (req, res)=>{

    try{
        // Generate hashed password
        const salt = await bcrypt.genSalt(10); //bcrypt is an asychronous method
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save user and respond with a response (res)
        const user = await newUser.save(); //.save() returns the full details of the user //returns a promise
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
});


// Login
// router.post("/login", async (req, res)=> {
//     try {
//     const user = await User.findOne({email: req.body.email}) //filtering the Users database for that user
//     !user && res.status(404).json("user not found")

//     const validPassword = await bcrypt.compare(req.body.password, user.password) //.compare(myPlaintextPassword, hash); user.password = hash_from_db
//     !validPassword && res.status(400).json("wrong password")
//     //else statement
//     res.status(200).json(user)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

// Had to use if statements to make this endpoint work properly and not &&
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }); // Filtering the Users collection for the user
      if (!user) {
        // console.log("User not found")
        return res.status(404).json("User not found");
      }
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        // console.log("Wrong password")
        return res.status(400).json("Wrong password");
      }
  
      // Successful login
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  





module.exports = router;

