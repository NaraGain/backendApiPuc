// module.exports = (io) => {
//   // Socket.IO logic
//   io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('startTimer', (data) => {
//       console.log('Received request to start timer:', data);

//       // Extracting hours, minutes, and seconds from the request
//       const { hours, minutes, seconds } = data;

//       // Convert everything to seconds
//       const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

//       let remainingTime = totalTimeInSeconds;

//       // Send initial time to the client
//       socket.emit('updateTimer', remainingTime);

//       // Update the timer every second
//       const timerInterval = setInterval(() => {
//         remainingTime--;

//         // Send updated time to the client
//         io.emit('updateTimer', remainingTime);

//         if (remainingTime <= 0) {
//           // Timer has reached zero, stop the interval
//           clearInterval(timerInterval);
//         }
//       }, 1000);
//     });

//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//     });
//   });
// };
function startCountdown(minutes, seconds ,io) {
    let totalSeconds = minutes * 60 + seconds;
  
    const timer = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      let remainingSeconds = totalSeconds % 60;
  
      // Add leading zero if seconds is less than 10
      if (remainingSeconds < 10) {
        remainingSeconds = `0${remainingSeconds}`;
      }
  
      io.emit('countdown', {minutes, remainingSeconds });
  
      totalSeconds--;
  
      if (totalSeconds < 0) {
        clearInterval(timer);
        io.emit('countdownFinished');
      }
    }, 1000); // Update every second (1000 milliseconds)
  }

  module.exports = startCountdown