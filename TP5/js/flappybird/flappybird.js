const canvas = document.getElementById('flappybird-canvas');
const ctx = canvas.getContext('2d');

const playBtn = document.getElementById('flappybird-play-btn');
const gameMenu = document.getElementById('flappybird-menu');
const gameContainer = document.getElementById('GameContainer');


// Cargar imágenes
const bg = new Image();
bg.src = '../../media/bg.png';
const birdImg = new Image();
birdImg.src = '../../media/bird.png';
const pipeTop = new Image();
pipeTop.src = '../../media/pipe_top.png';
const pipeBottom = new Image();
pipeBottom.src = '../../media/pipe_bottom.png';

// Cargar sonidos
const jumpSound = new Audio('jump.wav');
const hitSound = new Audio('hit.wav');

// Bird
const bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 24,
  gravity: 0.5,
  lift: -8,
  velocity: 0
};

// Pipes
const pipes = [];
const pipeGap = 120;
const pipeSpeed = 2;
let frame = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;
let started = false;

// Controls
document.addEventListener('keydown', () => {
  if (!started) started = true;
  if (!gameOver) {
    bird.velocity = bird.lift;
    jumpSound.play();
  } else {
    resetGame();
  }
});

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  frame = 0;
  gameOver = false;
  started = false;
}

// Game loop
function draw() {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  if (!started) {
    ctx.fillStyle = 'white';
    ctx.font = '28px Arial';
    ctx.fillText('Presiona cualquier tecla para comenzar', 20, canvas.height / 2);
    requestAnimationFrame(draw);
    return;
  }

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Pipes
  if (frame % 90 === 0) {
    const top = Math.random() * (canvas.height - pipeGap - 100);
    pipes.push({ x: canvas.width, top, bottom: top + pipeGap });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= pipeSpeed;

    ctx.drawImage(pipeTop, p.x, 0, 60, p.top);
    ctx.drawImage(pipeBottom, p.x, p.bottom, 60, canvas.height - p.bottom);

    // Colisión
    if (
      bird.x < p.x + 60 &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > p.bottom)
    ) {
      hitSound.play();
      gameOver = true;
    }

    if (p.x + 60 < bird.x && !p.passed) {
      score++;
      p.passed = true;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
      }
    }

    if (p.x + 60 < 0) {
      pipes.splice(i, 1);
    }
  }

  // Suelo / techo
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    hitSound.play();
    gameOver = true;
  }

  // Puntaje
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Puntaje: ' + score, 10, 30);
  ctx.fillText('Máximo: ' + highScore, 10, 60);

  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '32px Arial';
    ctx.fillText('¡Game Over!', canvas.width / 2 - 90, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Presiona cualquier tecla para reiniciar', canvas.width / 2 - 130, canvas.height / 2 + 40);
    return;
  }

  frame++;
  requestAnimationFrame(draw);
}


//Iniciar juego
    playBtn.addEventListener('click', function() {
        gameMenu.style.display = 'none';
        gameContainer.style.display = 'flex';
        draw();
    });

