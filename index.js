require('dotenv').config()
const express = require('express');
const cors = require('cors');
// const fileUpload = require('express-fileupload')
const app = express();
const http = require('http')
const socketIO = require('socket.io')
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
const { clearInterval } = require('timers');
const server = http.createServer(app)
const io = socketIO(server)


app.use(cors())
app.use(express.json())
app.use(errorHandlerMiddleware)
app.use(cookieParser())
app.use(express.static(path.join(__dirname , './public/upload')))
app.use(express.static(path.join(__dirname , './public/exam')))
app.use(express.static("./public/html"))
app.use(
    fileUpload({
      limits: { fileSize: 10 * 1024 * 1024 },
      createParentPath: true,
      safeFileNames : false,
    }),
  );

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





server.setMaxListeners(0)
function startCountdown(minutes, seconds) {
    let totalSeconds = minutes * 60 + seconds;
  
    const timer = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      let remainingSeconds = totalSeconds % 60;
  
      // Add leading zero if seconds is less than 10
      if (remainingSeconds < 10) {
        remainingSeconds = `0${remainingSeconds}`;
      }
  
      io.emit('countdown', { minutes, remainingSeconds });
  
      totalSeconds--;
  
      if (totalSeconds < 0) {
        clearInterval(timer);
        io.emit('countdownFinished');
      }
    }, 1000); // Update every second (1000 milliseconds)
  }
  
  // Socket.IO connection
  io.on('connection', (socket) => {
    console.log('Client connected', socket.id);
    // Start countdown when the client requests it
    socket.on('startCountdown', ({ minutes, seconds }) => {
      startCountdown(minutes, seconds);
    });
  });

  startCountdown(45,0)

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