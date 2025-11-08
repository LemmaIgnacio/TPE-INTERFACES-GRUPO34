let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let bestTimes = JSON.parse(localStorage.getItem('blockaBestTimes') || '{}');
let currentDiff = 'easy';
window.setBlockaDiff = function(diff) {
  currentDiff = diff;
  updateMaxDisplay();
}

const display = document.getElementById('display');
const maxDisplay = document.getElementById('max-time');
const startBtn = document.getElementById('blocka-start-btn');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function timeToString(time) {
  const mins = Math.floor((time % 3600000) / 60000);
  const secs = Math.floor((time % 60000) / 1000);
  const ms = Math.floor(time % 1000);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
}

function updateDisplay() {
  display.textContent = timeToString(elapsedTime);
}

function updateMaxDisplay() {
  let best = bestTimes[currentDiff] || 0;
  maxDisplay.textContent = `Mejor tiempo (${currentDiff}): ${timeToString(best)}`;
}

function start() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
  updateMaxDisplay();
}

function pause() {
  clearInterval(timerInterval);
}

function reset() {
  clearInterval(timerInterval);
  let best = bestTimes[currentDiff] || 0;
  if (elapsedTime > 0 && (best === 0 || elapsedTime < best)) {
    bestTimes[currentDiff] = elapsedTime;
    localStorage.setItem('blockaBestTimes', JSON.stringify(bestTimes));
  }
  elapsedTime = 0;
  updateDisplay();
  updateMaxDisplay();
}

startBtn.addEventListener('click', function(){ start(); });
/*pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);*/

updateDisplay();
updateMaxDisplay();
