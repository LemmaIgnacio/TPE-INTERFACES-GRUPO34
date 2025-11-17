async function main() {
  const canvas = document.getElementById('flappybird-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const playBtn = document.getElementById('flappybird-play-btn');
  const gameMenu = document.getElementById('flappybird-menu');
  const gameContainer = document.getElementById('GameContainer');

  // Ajustar tamaño del canvas si es necesario
  canvas.width = canvas.width || 800;
  canvas.height = canvas.height || 600;
  canvas.style.display = 'block';

  // Cargar imágenes
  const bg = new Image(); bg.src = '../media/flappybird/bg.png';
  const dragonImg = new Image(); dragonImg.src = '../media/flappybird/dragon-sprite-1.png';
  const pipeTop = new Image(); pipeTop.src = '../media/flappybird/pipe_top.png';
  const pipeBottom = new Image(); pipeBottom.src = '../media/flappybird/pipe_bottom.png';

  const images = [bg, dragonImg, pipeTop, pipeBottom].map(img =>
    new Promise(res => { img.onload = () => res(); img.onerror = () => res(); })
  );
// Sonidos (opcionales)
  const jumpSound = new Audio('../media/flappybird/jump.mp3');
  const hitSound = new Audio('../media/flappybird/hit.mp3');
  const plusPointSound = new Audio('../media/flappybird/point.mp3');
  jumpSound.onerror = () => {}; hitSound.onerror = () => {}; plusPointSound.onerror = () => {};

  // Estado del juego
  const dragon = { x: 50, y: 150, width: 35, height: 21, gravity: 0.5, lift: -8, velocity: 0 };
  const pipes = [];
  const pipeGap = 120;
  const pipeSpeed = 2;
  let frame = 0;
  let score = 0;
  let highScore = Number(localStorage.getItem('highScore') || 0);
  let gameOver = false;
  let started = false;
  let animating = false;

  function resetGame() {
    dragon.y = 150;
    dragon.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    gameOver = false;
    started = false;
  }

  function flap() {
    if (!started) started = true;
    if (!gameOver) {
      dragon.velocity = dragon.lift;
      try { jumpSound.currentTime = 0; jumpSound.play(); } catch (e) {}
    } else {
      resetGame();
      if (!animating) requestAnimationFrame(draw);
    }
  }

  // Controles
  function bindControls() {
    document.addEventListener('keydown', onKeydown);
    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  }
  function onKeydown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
      e.preventDefault();
      flap();
    }
  }
  function onTouchStart(e) {
    e.preventDefault();
    flap();
  }

  function unbindControls() {
    document.removeEventListener('keydown', onKeydown);
    canvas.removeEventListener('mousedown', flap);
    canvas.removeEventListener('touchstart', onTouchStart);
  }

  // Dibujo principal
  function draw() {
    animating = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bg.complete) ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    if (!started) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
      ctx.fillStyle = 'white';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Presiona cualquier tecla o click para comenzar', canvas.width / 2, canvas.height / 2 + 8);
      if (!gameOver) requestAnimationFrame(draw);
      return;
    }

    // Física del pájaro
    dragon.velocity += dragon.gravity;
    dragon.y += dragon.velocity;
    if (dragonImg.complete) ctx.drawImage(dragonImg, dragon.x, dragon.y, dragon.width, dragon.height);
    // Generar pipes
    if (frame % 90 === 0) {
      const top = Math.random() * (canvas.height - pipeGap - 140) + 40;
      pipes.push({ x: canvas.width, top, bottom: top + pipeGap, passed: false });
    }

    // Dibujar y actualizar pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= pipeSpeed;

      if (pipeTop.complete) ctx.drawImage(pipeTop, p.x, 0, 60, p.top);
      if (pipeBottom.complete) ctx.drawImage(pipeBottom, p.x, p.bottom, 60, canvas.height - p.bottom);

      // Colisión
      if (
        dragon.x < p.x + 60 &&
        dragon.x + dragon.width > p.x &&
        (dragon.y < p.top || dragon.y + dragon.height > p.bottom)
      ) {
        try { hitSound.currentTime = 0; hitSound.play(); } catch (e) {}
        gameOver = true;
      }

      if (p.x + 60 < dragon.x && !p.passed) {
        score++;
        p.passed = true;
        try { plusPointSound.currentTime = 0; plusPointSound.play(); } catch (e) {}
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', String(highScore));
        }
      }

      if (p.x + 60 < 0) {
        pipes.splice(i, 1);
      }
    }

    // Suelo / techo
    if (dragon.y + dragon.height > canvas.height || dragon.y < 0) {
      try { hitSound.currentTime = 0; hitSound.play(); } catch (e) {}
      gameOver = true;
    }

    // UI: fondo del puntaje y texto
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(10, 10, 160, 60);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Puntaje: ' + score, 20, 34);
    ctx.fillText('Máximo: ' + highScore, 20, 58);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height / 2 - 70, canvas.width, 140);
      ctx.fillStyle = 'red';
      ctx.font = '42px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Game Over!', canvas.width / 2, canvas.height / 2 - 8);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('Presiona cualquier tecla o click para reiniciar', canvas.width / 2, canvas.height / 2 + 28);
      animating = false;
      return;
    }

    frame++;
    requestAnimationFrame(draw);
  }

  // Bind play button to start the game (wait images)
  if (playBtn) {
    playBtn.addEventListener('click', async function () {
      if (gameMenu) gameMenu.style.display = 'none';
      if (gameContainer) gameContainer.style.display = 'flex';
      await Promise.all(images);
      resetGame();
      bindControls();
      if (!animating) requestAnimationFrame(draw);
    });
  } else {
    // If no play button, auto-start once images loaded
    await Promise.all(images);
    resetGame();
    bindControls();
    if (!animating) requestAnimationFrame(draw);
  }
}

















//-----------------------------------------------------------------
// Ejecutar main al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  main().catch(err => console.error('FlappyBird init error:', err));
});

