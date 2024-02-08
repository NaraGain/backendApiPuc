require('dotenv').config()
const express = require('express');
const cors = require('cors');
// const fileUpload = require('express-fileupload')
const app = express();
const http = require('http')
const  { connectionDb } = require('./connection')
const path = require('path')
const userRoute = require('./route/userRoute')
const errorHandlerMiddleware = require('./middleware/errorHandleMiddleware');
const cookieParser = require('cookie-parser');
const { auth, checkRole } = require('./middleware/auth');
const testRoute = require("./route/testRoute")
const groupRoute = require("./route/groupRoute")
const examRoute = require("./route/examRoute");
const quizRoute = require("./route/quizRoute")
const reportRoute = require("./route/reportRoute")
const questionRoute = require('./route/questionRoute');
const studentRoute = require("./route/studentRoute")
const addressRoute = require("./route/addressRoute")
const fileUpload = require('express-fileupload');
const server = http.createServer(app)
const startCountdown = require("./External/timer")
const socketIO = require('socket.io')


app.use(cors())
app.use(express.json())
app.use(errorHandlerMiddleware)
app.use(cookieParser())
app.use(express.static(path.join(__dirname , './public/upload')))
app.use(express.static(path.join(__dirname , './public/logo')))
app.use(express.static(path.join(__dirname , './public/exam')))
app.use(express.static("./public/html"))
app.use(
    fileUpload({
      limits: { fileSize: 10 * 1024 * 1024 },
      createParentPath: true,
      safeFileNames : false,
    }),
  );

 const io = socketIO(server, {
    cors : {
      originAdmin : process.env.ORIGIN_ADMIN,
      originStudent : process.env.ORIGIN_STUDENT
    }
  })
  

app.get("/auth-endpoint", auth, (req,res)=>{
    res.status(200).json({
        message: "You are authorized to access me"
    })
})


app.use('/user', userRoute)
app.use("/student", studentRoute)
app.use('/test', testRoute)
app.use('/group', groupRoute)
app.use("/exam", examRoute)
app.use("/quiz" , quizRoute)
app.use("/question", questionRoute)
app.use("/address", addressRoute)
app.use("/report" ,reportRoute)
app.post("/exam/start",
 auth , checkRole(["superadmin","admin"]),
 (req, res)=>{
   try {
     io.emit('startTimer', 
     startCountdown(req.body.minutes,
      req.body.seconds,io))
      res.status(200).json({
        message : "exam start",
        success : true,
      })
   } catch (error) {
      res.status(400).json({
        message : "error internal server could not response",
        success : false,
      })
   }
})


server.setMaxListeners(0)
  // Socket.IO connection
  io.on('connection', (socket) => {
    // Start countdown when the client requests it
    socket.on('startCountdown', ({ minutes, seconds }) => {
      startCountdown(minutes, seconds , io);
    });
  });

  __dirname = path.resolve()
  if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname , 'client/build')));
    app.get('*' , (req,res)=> {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  }

const start = async ()=>{
    try{
       await connectionDb(process.env.MONGO_URI)
         server.listen(process.env.port,()=>{
         console.log(`application are running on port ${process.env.port}`)
        })

    }catch(err){
        console.log(err)
    }
}

start()


