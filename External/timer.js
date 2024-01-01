

function startCountdown(minutes, seconds ,io) {
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

  module.exports = startCountdown