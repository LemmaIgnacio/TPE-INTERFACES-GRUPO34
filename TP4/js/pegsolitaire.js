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
        const cellSize = 80;
        const rows = tablero.casillas.length;
        const cols = tablero.casillas[0].length;
        const boardWidth = cols * cellSize;
        const boardHeight = rows * cellSize;
        const offsetX = (canvas.width - boardWidth) / 2;
        const offsetY = (canvas.height - boardHeight) / 2;
        const dirs = [
            {di: -2, dj: 0}, // arriba
            {di: 2, dj: 0},  // abajo
            {di: 0, dj: -2}, // izquierda
            {di: 0, dj: 2}   // derecha
        ];
        for (const dir of dirs) {
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
        if (dir.di === -2) { // arriba
            ctx.moveTo(0, -20); ctx.lineTo(-10, 0); ctx.lineTo(10, 0); ctx.closePath();
        } else if (dir.di === 2) { // abajo
            ctx.moveTo(0, 20); ctx.lineTo(-10, 0); ctx.lineTo(10, 0); ctx.closePath();
        } else if (dir.dj === -2) { // izquierda
            ctx.moveTo(-20, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath();
        } else if (dir.dj === 2) { // derecha
            ctx.moveTo(20, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath();
        }
        ctx.fillStyle = 'rgba(132,233,221,0.8)';
        ctx.shadowColor = '#84E9DD';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
        requestAnimationFrame(drawBoard);
    }



    // Obtener celda por coords del mouse
    function getCellFromCoords(mx, my) {
        const cellSize = 80;
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
    canvas.addEventListener('mouseup', function(e) {
        if (!draggingFicha) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cell = getCellFromCoords(mx, my);
        if (cell && tablero && draggingFicha.ficha) {
            if (tablero.validMove(draggingFicha.from, cell)) {
                tablero.moveFicha(draggingFicha.from, cell);
            }
        }
        draggingFicha = null;
        drawBoard();
    });

    //Dibuja la ficha que se está arrastrando
    function drawDraggingFicha(drag) {
        const cellSize = 80;
        drag.ficha.render(ctx, drag.mouseX - cellSize/2, drag.mouseY - cellSize/2, cellSize);
    }

    //Iniciar juego
    playBtn.addEventListener('click', function() {
        gameMenu.style.display = 'none';
        gameContainer.style.display = 'flex';
        drawBoard();
        cron.start();
    });

    // Reiniciar juego
    const restartBtn = document.getElementById('pegsolitaire-restart-btn');
    function restartGame() {
        tablero.init();
        drawBoard();
        cron.reset();
        cron.start();
        draggingFicha = null;
    }
    if (restartBtn) restartBtn.addEventListener('click', restartGame);


    




    // Llama onGameFinished() en el código donde detectas fin de partida / victoria

}
