importScriptsIfNeeded();

function importScriptsIfNeeded() {
    if (typeof Tablero === 'undefined') {
        var script = document.createElement('script');
        script.src = '../js/pegsolitaire/gameObjects.js';
        script.onload = main;
        document.head.appendChild(script);
    } else {
        main();
    }
}

function main() {
    const playBtn = document.getElementById('pegsolitaire-play-btn');
    const gameMenu = document.getElementById('pegsolitaire-menu');
    const gameContainer = document.getElementById('GameContainer');
    const canvas = document.getElementById('pegsolitaire-canvas');
    const ctx = canvas.getContext('2d');
    

    function resizeCanvas() {
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
    }
    resizeCanvas();

    let tablero;
    const fondoPath = "../media/PegSolitarie/board.png";

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!tablero) {
            tablero = new Tablero(fondoPath);
            tablero.init();
            
        }
        tablero.render(ctx);
        tablero.renderCasillas(ctx);
        if (draggingFicha && draggingFicha.ficha) {
            drawHints(tablero, draggingFicha.from);
            drawDraggingFicha(draggingFicha);
        }
    }

    function drawHints(tablero, from) {
        const cellSize = 85;
        const rows = tablero.casillas.length;
        const cols = tablero.casillas[0].length;
        const boardWidth = cols * cellSize;
        const boardHeight = rows * cellSize;
        const offsetX = (canvas.width - boardWidth) / 2;
        const offsetY = (canvas.height - boardHeight) / 2;
        const dirs_1 = [
            {di: -3, dj: 0}, // arriba
            {di: 3, dj: 0},  // abajo
            {di: 0, dj: -3}, // izquierda
            {di: 0, dj: 3}   // derecha
        ];
        const dirs_2 = [
            {di: -2, dj: 0}, // arriba
            {di: 2, dj: 0},  // abajo
            {di: 0, dj: -2}, // izquierda
            {di: 0, dj: 2}   // derecha
        ];

        for (const dir of dirs_1) {
            const to = {i: from.i + dir.di, j: from.j + dir.dj};
            if (to.i >= 0 && to.i < rows && to.j >= 0 && to.j < cols) {
                if (tablero.validMove(from, to)) {
                    // Dibujar hint
                    drawAnimatedArrow(
                        offsetX + to.j * cellSize + cellSize/2,
                        offsetY + to.i * cellSize + cellSize/2,
                        dir
                    );
                }
            }
        }
        for (const dir of dirs_2) {
            const to = {i: from.i + dir.di, j: from.j + dir.dj};
            if (to.i >= 0 && to.i < rows && to.j >= 0 && to.j < cols) {
                if (tablero.validMove(from, to)) {
                    // Dibujar hint
                    drawAnimatedArrow(
                        offsetX + to.j * cellSize + cellSize/2,
                        offsetY + to.i * cellSize + cellSize/2,
                        dir
                    );
                }
            }
        }
    }

    // Hint
    function drawAnimatedArrow(x, y, dir) {
        // Flecha
        const t = Date.now() % 1000;
        const scale = 1 + 0.2 * Math.sin(t / 1000 * 2 * Math.PI);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.beginPath();
        if (dir.di === -3) { // arriba
            ctx.moveTo(0, -20); ctx.lineTo(-10, 0); ctx.lineTo(10, 0); ctx.closePath();
        } else if (dir.di === 3) { // abajo
            ctx.moveTo(0, 20); ctx.lineTo(-10, 0); ctx.lineTo(10, 0); ctx.closePath();
        } else if (dir.dj === -3) { // izquierda
            ctx.moveTo(-20, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath();
        } else if (dir.dj === 3) { // derecha
            ctx.moveTo(20, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath();
        }
        if (dir.di === -2) { // arriba
            ctx.moveTo(0, -20); ctx.lineTo(-10, 0); ctx.lineTo(10, 0); ctx.closePath();
        } else if (dir.di === 2) { // abajo
            ctx.moveTo(0, 20); ctx.lineTo(-10, 0); ctx.lineTo(10, 0); ctx.closePath();
        } else if (dir.dj === -2) { // izquierda
            ctx.moveTo(-20, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath();
        } else if (dir.dj === 2) { // derecha
            ctx.moveTo(20, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath();
        }
        ctx.fillStyle = 'rgba(0, 255, 225, 0.8)';
        ctx.shadowColor = '#000000ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
        requestAnimationFrame(drawBoard);
    }



    // Obtener celda por coords del mouse
    function getCellFromCoords(mx, my) {
        const cellSize = 85;
        const rows = tablero.casillas.length;
        const cols = tablero.casillas[0].length;
        const boardWidth = cols * cellSize;
        const boardHeight = rows * cellSize;
        const offsetX = (canvas.width - boardWidth) / 2;
        const offsetY = (canvas.height - boardHeight) / 2;
        const j = Math.floor((mx - offsetX) / cellSize);
        const i = Math.floor((my - offsetY) / cellSize);
        if (i >= 0 && i < rows && j >= 0 && j < cols) {
            return {i, j};
        }
        return null;
    }

    // Iniciar arrastre
    canvas.addEventListener('mousedown', function(e) {
        if (!tablero) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cell = getCellFromCoords(mx, my);
        if (!cell) return;
        const casilla = tablero.casillas[cell.i][cell.j];
        if (casilla instanceof Ficha) {
            draggingFicha = {
                ficha: casilla,
                from: cell,
                offsetX: mx,
                offsetY: my,
                mouseX: mx,
                mouseY: my
            };
        }
    });

    // Arrastrar la ficha
    canvas.addEventListener('mousemove', function(e) {
        if (!draggingFicha) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        draggingFicha.mouseX = mx;
        draggingFicha.mouseY = my;
        drawBoard();
    });

    // Soltar la ficha
        // Soltar la ficha
    canvas.addEventListener('mouseup', function(e) {
        if (!draggingFicha) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cell = getCellFromCoords(mx, my);
        
        let movementMade = false;
        if (cell && tablero && draggingFicha.ficha) {
            if (tablero.validMove(draggingFicha.from, cell)) {
                if (!timerStarted) {
                    timer.start();
                    timerStarted = true;
                }
                tablero.moveFicha(draggingFicha.from, cell);
                movementMade = true;
                draggingFicha = null;
                
                // Verificar estado del juego después del movimiento
                const gameState = tablero.checkGameState();
                console.log(gameState);
                if (gameState === 'won') {
                    setTimeout(() => {
                        alert('¡Felicidades! ¡Has ganado!');
                        gameMenu.style.display = 'block';
                        gameContainer.style.display = 'none';
                    }, 500);
                } else if (gameState === 'lost') {
                    setTimeout(() => {
                        const fichasRestantes = tablero.countFichas();
                        alert(`Juego terminado. Te quedaron ${fichasRestantes} fichas. ¡Intenta de nuevo!`);
                        gameMenu.style.display = 'block';
                        gameContainer.style.display = 'none';
                    }, 500);
                }
            }
        }
        
        // Limpiar arrastre SIEMPRE antes de redibujar
        draggingFicha = null;
        drawBoard();
    });

    //Dibuja la ficha que se está arrastrando
    function drawDraggingFicha(drag) {
        const cellSize = 85;
        drag.ficha.render(ctx, drag.mouseX - cellSize/2, drag.mouseY - cellSize/2, cellSize);
    }

    const timerDisplay = document.getElementById('display');
    const timer = new Temporizador(10 * 60 * 1000, timerDisplay); // 10 minutos
    let draggingFicha = null;
    let timerStarted = false;

    //Iniciar juego
    playBtn.addEventListener('click', function() {
        gameMenu.style.display = 'none';
        gameContainer.style.display = 'flex';
        if (tablero) {
            tablero.init();
        }
        drawBoard();
        timer.reset();
        timerStarted = false;
    });

    // Reiniciar juego
    const restartBtn = document.getElementById('pegsolitaire-restart-btn');
    function restartGame() {
        tablero.init();
        drawBoard();
        timer.reset();
        draggingFicha = null;
        timerStarted = false;
    }
    if (restartBtn) restartBtn.addEventListener('click', restartGame);


    




    // Llama onGameFinished() en el código donde detectas fin de partida / victoria

}