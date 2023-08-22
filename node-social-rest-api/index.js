const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const multer  = require('multer');
const path = require("path");

const app = express();

dotenv.config(); //Loads .env file contents into `process.env`. 

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("Connected to MongoDB")
});

// Here we are saying, when we go to this endpoint, no request should be made, instead, go to this static file directory
app.use("/images", express.static(path.join(__dirname, "public/images"))) //To 

// Initializizng 'body Parser' req.body Middleware
app.use(express.json()); //To make sure we handle json responses properly
app.use(helmet())
app.use(morgan("common")) //For timing

// For files upload to server side //Not recommended
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        console.log(req.body.name, req.body)
        cb(null, req.body.name) //file.originalname //for only postman
    }
})

const upload = multer({storage})
app.post("/api/upload", upload.single("file"), (req, res) => { //This first line uploads the file for us
    try{
        return res.status(200).json("File uploaded successfully")
    }catch(err){
        console.log(err)
    }
} )  //we dont want to put it under routes, because it is just one endpoint



app.use('/api/users', userRoute); // '/api/users' , this is the real url, the userRoutes is path to the file location
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);  
app.use('/api/conversations', conversationRoute); // '/api/conversations' ->  './routes/conversations'
app.use('/api/messages', messageRoute);


const PORT = 8800 ; //process.env.PORT || 
//Takes a Port and an arrow function
app.listen(PORT, () => console.log(`Backend Server started on port ${PORT}`));




















