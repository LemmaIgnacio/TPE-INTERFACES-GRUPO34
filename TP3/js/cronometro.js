let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let maxTime = localStorage.getItem('maxTime') || 0;

const display = document.getElementById('display');
const maxDisplay = document.getElementById('max-time');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function timeToString(time) {
  const hrs = Math.floor(time / 3600000);
  const mins = Math.floor((time % 3600000) / 60000);
  const secs = Math.floor((time % 60000) / 1000);
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  display.textContent = timeToString(elapsedTime);
}

function updateMaxDisplay() {
  maxDisplay.textContent = `Máximo: ${timeToString(maxTime)}`;
}

function start() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 1000);
}

function pause() {
  clearInterval(timerInterval);
}

function reset() {
  clearInterval(timerInterval);
  if (elapsedTime > maxTime) {
    maxTime = elapsedTime;
    localStorage.setItem('maxTime', maxTime);
  }
  elapsedTime = 0;
  updateDisplay();
  updateMaxDisplay();
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);

updateDisplay();
updateMaxDisplay();
