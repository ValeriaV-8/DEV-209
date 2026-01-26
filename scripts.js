let totalSeconds = 0;
const timerElement = document.querySelector('.timer-container');

if (timerElement) {
  const updateTimer = () => {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.textContent = formattedTime;
  };

  // Initial display
  timerElement.textContent = "00:00";

  setInterval(updateTimer, 1000);
}