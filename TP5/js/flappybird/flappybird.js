import {loadSprite, makeSprite, makeLayer, makeInfiniteScroll} from "./utils.js";



async function main() {
  const canvas = document.getElementById('flappybird-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const playBtn = document.getElementById('flappybird-play-btn');
  const gameMenu = document.getElementById('flappybird-menu');
  const gameContainer = document.getElementById('GameContainer');

  canvas.width = canvas.width || 800;
  canvas.height = canvas.height || 600;
  canvas.style.display = 'block';

  //Parallax
    ctx.imageSmoothingEnabled = false; //Para que el arte pixel no se vea mal
    // Parallax: cargamos las imágenes y creamos los objetos, pero no usamos
    // un loop separado. Los dibujaremos desde la función `draw()` para que
    // siempre sean el fondo y se escalen al tamaño del canvas.
    const [layer1, layer2, layer3, layer4] = await Promise.all([
    loadSprite("../media/flappybird/parallax/1.png"),
    loadSprite("../media/flappybird/parallax/2.png"),
    loadSprite("../media/flappybird/parallax/3.png"),
    loadSprite("../media/flappybird/parallax/4.png"),
    ]);

    // Escalar cada layer para que su altura coincida con la altura del canvas
    const scale1 = canvas.height / layer1.height || 1;
    const scale2 = canvas.height / layer2.height || 1;
    const scale3 = canvas.height / layer3.height || 1;
    const scale4 = canvas.height / layer4.height || 1;

    // Posicionar cada layer en y = 0 (se ajustan por su escala)
    const layer1GameObj = makeSprite(ctx, layer1, { x: 0, y: 0 }, scale1);
    const layer2GameObj = makeLayer(ctx, layer2, { x: 0, y: 0 }, scale2);
    const layer3GameObj = makeLayer(ctx, layer3, { x: 0, y: 0 }, scale3);
    const layer4GameObj = makeLayer(ctx, layer4, { x: 0, y: 0 }, scale4);

    // Tiempo para parallax (se usa dentro de draw)
      let parallaxOldTime = 0;
      let parallaxMoving = false; // parallax stays still until keydown in bindControls

  // Cargar imágenes
  //const bg = new Image(); bg.src = '../media/flappybird/bg.png';
  const dragonImg = new Image(); dragonImg.src = '../media/flappybird/dragon.png';
  const coinImg = new Image(); coinImg.src = '../media/flappybird/coin.png';
  const pipeTop = new Image(); pipeTop.src = '../media/flappybird/pipe_top.png';
  const pipeBottom = new Image(); pipeBottom.src = '../media/flappybird/pipe_bottom.png';

  const images = [dragonImg, coinImg, pipeTop, pipeBottom].map(img =>
    new Promise(res => { img.onload = () => res(); img.onerror = () => res(); })
  );

  //Sonidos
  const jumpSound = new Audio('../media/flappybird/jump.mp3');
  const hitSound = new Audio('../media/flappybird/hit.mp3');
  const plusPointSound = new Audio('../media/flappybird/point.mp3');
  jumpSound.onerror = () => {}; hitSound.onerror = () => {}; plusPointSound.onerror = () => {};

  //CONFIGURACIÓN DE ANIMACIÓN DE SPRITE

  //Dragón.
  const dragon = { 
    x: 50, 
    y: 150, 
    width: 40, 
    height: 30, 
    gravity: 0.5, 
    lift: -8, 
    velocity: 0,
    // Propiedades para la animación.
    currentFrame: 0,
    frameCounter: 0,
    isAnimating: false,
    animationDirection: 1,  // 1 = adelante, -1 = atrás
    spriteConfig: {
      frameWidth: 200,      // Ancho de cada frame en el sprite.
      frameHeight: 150,     // Alto de cada frame.
      gapBetweenFrames: 10, // Espacio entre frames.
      framesPerRow: 3,     // Frames por fila en el sprite sheet.
      animationSpeed: 4    // Cambiar frame cada X frames del juego. (menor = más rápido)
    }
  };

  //Moneda.
  const coinConfig = {
    spriteConfig: {
      frameWidth: 200,      // Ancho de cada frame en el sprite.
      frameHeight: 250,     // Alto de cada frame.
      gapBetweenFrames: 0, // Espacio entre frames.
      framesPerRow: 6,     // Frames por fila en el sprite sheet.
      animationSpeed: 4    // Cambiar frame cada X frames del juego. (menor = más rápido)
    }
  };

  //Estado del juego
  const pipes = [];
  const coins = [];
  const objectGap = 120;
  const objectSpeed = 2;
  const coinSpawnChance = 0.3;
  let frame = 0;
  let score = 0;
  let highScore = Number(localStorage.getItem('highScore') || 0);
  let gameOver = false;
  let started = false;
  let animating = false;

  function resetGame() {
    dragon.y = 150;
    dragon.velocity = 0;
    dragon.currentFrame = 0;
    dragon.frameCounter = 0;
    dragon.isAnimating = false;
    dragon.animationDirection = 1;
    pipes.length = 0;
    coins.length = 0;
    score = 0;
    frame = 0;
    gameOver = false;
    started = false;
    parallaxMoving = false; // Reset parallax on game restart
  }

  function flap() {
    if (!started) started = true;
    if (!gameOver) {
      dragon.velocity = dragon.lift;
      // Iniciar la animación desde el frame 1
      dragon.currentFrame = 0;
      dragon.isAnimating = true;
      dragon.animationDirection = 1;
      dragon.frameCounter = 0;
      try { jumpSound.currentTime = 0; jumpSound.play(); } catch (e) {}
    } else {
      resetGame();
      if (!animating) requestAnimationFrame(draw);
    }
  }

  //Función para actualizar el frame de animación del dragón.
  function updateDragonAnimation() {
    if (!dragon.isAnimating) return;
    
    dragon.frameCounter++;
    if (dragon.frameCounter >= dragon.spriteConfig.animationSpeed) {
      dragon.frameCounter = 0;
      
      // Actualizar frame según la dirección
      dragon.currentFrame += dragon.animationDirection;
      
      // Si llegamos al frame 3, cambiar dirección a reversa.
      if (dragon.currentFrame >= 2 && dragon.animationDirection === 1) {
        dragon.animationDirection = -1;
      }
      
      // Si volvimos al frame 1, terminar la animación.
      if (dragon.currentFrame <= 1 && dragon.animationDirection === -1) {
        dragon.currentFrame = 0;
        dragon.isAnimating = false;
        dragon.animationDirection = 1;
      }
    }
  }

  //Función para actualizar el frame de animación del dragón.
  function updateCoinAnimation(coin) {    
    coin.frameCounter++;
    if (coin.frameCounter >= coin.spriteConfig.animationSpeed) {
      coin.frameCounter = 0;
      
      // Actualizar frame según la dirección
      coin.currentFrame += coin.animationDirection;
      
      // Si llegamos al frame 5, cambiar dirección a reversa.
      if (coin.currentFrame >= 5 && coin.animationDirection === 1) {
        coin.animationDirection = -1;
      }
      
      // Si volvimos al frame 1, terminar la animación.
      if (coin.currentFrame <= 1 && coin.animationDirection === -1) {
        coin.currentFrame = 0;
        coin.animationDirection = 1;
      }
    }
  }

  // Función para dibujar el dragón con el frame actual.
  function drawFrame(entity, image) {
    if (!image.complete) return;
    
    // Calcular la posición del frame en el sprite sheet.
    const frameX = entity.spriteConfig.gapBetweenFrames + (entity.currentFrame * (entity.spriteConfig.frameWidth + entity.spriteConfig.gapBetweenFrames));
    const frameY = Math.floor(entity.currentFrame / entity.spriteConfig.framesPerRow) * entity.spriteConfig.frameHeight;
    
    // Dibujar el frame específico del sprite.
    ctx.drawImage(
      image,
      frameX, frameY,                           // Posición en el sprite sheet
      entity.spriteConfig.frameWidth,                   // Ancho del frame
      entity.spriteConfig.frameHeight,                  // Alto del frame
      entity.x, entity.y,                        // Posición en el canvas
      entity.width, entity.height                // Tamaño de dibujado
    );
  }

  //-------------------------------------------------------------------------
  // Controles
  function bindControls() {
    document.addEventListener('keydown', onKeydown);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  }
  function onMouseDown(e) {
    e.preventDefault();
    // Start parallax movement on mouse click
    parallaxMoving = true;
    parallaxOldTime = performance.now();
    flap();
  }
  function onKeydown(e) {
    if(e.code === 'ArrowDown') {
      e.preventDefault();
    }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
      e.preventDefault();
      // Start parallax movement specifically on keydown
      parallaxMoving = true;
      parallaxOldTime = performance.now();
      flap();
    }
  }
  function onTouchStart(e) {
    e.preventDefault();
    // Start parallax movement on touch
    parallaxMoving = true;
    parallaxOldTime = performance.now();
    flap();
  }

  function unbindControls() {
    document.removeEventListener('keydown', onKeydown);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('touchstart', onTouchStart);
  }

  function addOnePoint() {
    score++;
    try { plusPointSound.currentTime = 0; plusPointSound.play(); } catch (e) {}
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', String(highScore));
    }
  }
  
  
  // Dibujo principal
  function draw(timeStamp) {
    animating = true;

    // Calcular delta time para parallax. Solo avanzar si parallaxMoving=true.
    if (typeof timeStamp === 'undefined') timeStamp = performance.now();
    let pdt = 0;
    if (parallaxMoving) {
      if (parallaxOldTime) pdt = (timeStamp - parallaxOldTime) / 1000;
      parallaxOldTime = timeStamp;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar parallax escalado al tamaño del canvas (fondo)
    if (typeof layer1GameObj !== 'undefined') layer1GameObj.draw();
    if (typeof layer2GameObj !== 'undefined') makeInfiniteScroll(pdt, layer2GameObj, -50 * (scale2 || 1));
    if (typeof layer3GameObj !== 'undefined') makeInfiniteScroll(pdt, layer3GameObj, -100 * (scale3 || 1));
    if (typeof layer4GameObj !== 'undefined') makeInfiniteScroll(pdt, layer4GameObj, -150 * (scale4 || 1));


    if (!started) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
      ctx.fillStyle = 'white';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Presiona cualquier tecla o click para comenzar', canvas.width / 2, canvas.height / 2 + 8);
      // Dibujar dragón estático.
      drawFrame(dragon, dragonImg);
      if (!gameOver) requestAnimationFrame(draw);
      return;
    }

    // Física del dragón.
    dragon.velocity += dragon.gravity;
    dragon.y += dragon.velocity;
    
    //Actualizar y dibujar animación del dragón.
    updateDragonAnimation();
    drawFrame(dragon, dragonImg);

    //Generar pipes.
    if (frame % 90 === 0) {
      const top = Math.random() * (canvas.height - objectGap - 140) + 40;
      pipes.push({ x: canvas.width, top, bottom: top + objectGap, passed: false });
    }
    
    //Generar coins. (En el espacio entre tuberías)
    if (frame % 90 === 0 && pipes.length > 0) {
      if (Math.random() <= coinSpawnChance) {
        // Usar la misma posición Y que el último pipe generado.
        const lastPipe = pipes[pipes.length - 1];
        // Colocar la moneda en el centro del gap.
        const coinY = lastPipe.top + (objectGap / 2) - 15;
        coins.push({
          x: canvas.width + 12,
          y: coinY,
          top: 30,
          bottom: 30,
          width: 30,
          height: 30,
          currentFrame: 0,
          frameCounter: 0,
          animationDirection: 1,
          spriteConfig: coinConfig.spriteConfig
        });
      }
    }

    //Dibujar y actualizar pipes.
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= objectSpeed;

      if (pipeTop.complete) ctx.drawImage(pipeTop, p.x, 0, 60, p.top);
      if (pipeBottom.complete) ctx.drawImage(pipeBottom, p.x, p.bottom, 60, canvas.height - p.bottom);

      // Colisión con tubería (Agregar Explosión)
      if (
        dragon.x < p.x+ 60 &&
        dragon.x + dragon.width > (p.x+5) &&
        (dragon.y < (p.top-2) || dragon.y + dragon.height > (p.bottom+4))
      ) {
        try { hitSound.currentTime = 0; hitSound.play(); } catch (e) {}
        
        gameOver = true;
        parallaxMoving = false; // Stop parallax on collision
      }

      if ((p.x + 60 < dragon.x && !p.passed)) {
        addOnePoint();
        p.passed = true;
      }

      if (p.x + 60 < 0) {
        pipes.splice(i, 1);
      }
    }

    //Dibujar y actualizar coins.
    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];

      if (coinImg.complete) {
        updateCoinAnimation(coin);
        drawFrame(coin, coinImg);
        coin.x -= objectSpeed;
      }
      
      // Colisión con moneda.
      if (
        dragon.x < coin.x + 30 &&
        dragon.x + dragon.width > coin.x &&
        (
          dragon.y < coin.top ||
          dragon.y + dragon.height > coin.bottom
        )
      ) {
        addOnePoint();
        coins.splice(i, 1);
      }

      if (coin.x < 0) {
        coins.splice(i, 1);
      }
    }

    // Suelo / techo.
    if (dragon.y + dragon.height > canvas.height || dragon.y < 0) {
      try { hitSound.currentTime = 0; hitSound.play(); } catch (e) {}
      gameOver = true;
      parallaxMoving = false; // Stop parallax on ground/ceiling hit
    }

    // UI: fondo del puntaje y texto.
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

  //Bind play button to start the game (wait images)
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
    // If no play button, auto-start once images loaded.
    await Promise.all(images);
    resetGame();
    bindControls();
    if (!animating) requestAnimationFrame(draw);
  }
}











//---------------------------------------------------------------------------------------------------------
// Ejecutar main al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  main().catch(err => console.error('FlappyBird init error:', err));
});