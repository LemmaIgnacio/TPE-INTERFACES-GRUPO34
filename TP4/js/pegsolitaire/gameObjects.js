// Tablero
class Tablero {

    constructor(fondoPath) {
        this.fondo = new window.Image();
        this.fondo.src = fondoPath || "../";
        this.casillas = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
    }

        renderCasillas(ctx) {
            // Tamaño de cada casilla
            const cellSize = 80;
            const rows = this.casillas.length;
            const cols = this.casillas[0].length;
            // Calcular tamaño total del tablero
            const boardWidth = cols * cellSize;
            const boardHeight = rows * cellSize;
            // Centrar el tablero en el canvas
            const offsetX = (ctx.canvas.width - boardWidth) / 2;
            const offsetY = (ctx.canvas.height - boardHeight) / 2;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const x = offsetX + j * cellSize;
                    const y = offsetY + i * cellSize;
                    const casilla = this.casillas[i][j];
                    // No dibujar nada si es vacio o centro
                    if (casilla === null || casilla === 0) continue;
                    ctx.save();
                    ctx.strokeStyle = '#bdbdbd';
                    ctx.lineWidth = 2;
                    ctx.fillStyle = '#f5f5f5';
                    ctx.beginPath();
                    ctx.arc(x + cellSize/2, y + cellSize/2, cellSize/2.2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    if (casilla instanceof Ficha) {
                        casilla.render(ctx, x, y, cellSize);
                    }
                }
            }
        }

    /*
     * Inicializa las casillas del tablero con fichas y valores null.
     * Forma clásica: tablero en cruz, esquinas inválidas (null), centro vacío.
     */
    init() {
        // null = casilla inválida
        // FichaAzul = casilla con ficha,
        // 0 = casilla vacía
        // Tablero clásico 7x7 
        this.casillas = [
            [null, null, new FichaAzul(), new FichaAzul(), new FichaAzul(), null, null],
            [null, null, new FichaAzul(), new FichaAzul(), new FichaAzul(), null, null],
            [new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul()],
            [new FichaAzul(), new FichaAzul(), new FichaAzul(), 0, new FichaAzul(), new FichaAzul(), new FichaAzul()],
            [new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul(), new FichaAzul()],
            [null, null, new FichaAzul(), new FichaAzul(), new FichaAzul(), null, null],
            [null, null, new FichaAzul(), new FichaAzul(), new FichaAzul(), null, null]
        ];
    }

    validMove(from, to) {
        if (!from || !to) return false;
        // Debe haber ficha en origen y destino debe estar vacío
        const ficha = this.casillas[from.i][from.j];
        if (!(ficha instanceof Ficha)) return false;
        if (this.casillas[to.i][to.j] !== 0) return false;
        // Movimiento de 2 celdas
        const di = to.i - from.i;
        const dj = to.j - from.j;
        if (Math.abs(di) === 2 && dj === 0) {
            // Salto vertical
            const midI = from.i + di/2;
            const midJ = from.j;
            const fichaSaltada = this.casillas[midI][midJ];
            if (fichaSaltada instanceof Ficha) return true;
        } else if (Math.abs(dj) === 2 && di === 0) {
            // Salto horizontal
            const midI = from.i;
            const midJ = from.j + dj/2;
            const fichaSaltada = this.casillas[midI][midJ];
            if (fichaSaltada instanceof Ficha) return true;
        }
        return false;
    }

    moveFicha(from, to) {
        if (!this.validMove(from, to)) return false;
        const ficha = this.casillas[from.i][from.j];
        // Eliminar ficha saltada
        const di = to.i - from.i;
        const dj = to.j - from.j;
        let midI, midJ;
        if (Math.abs(di) === 2 && dj === 0) {
            midI = from.i + di/2;
            midJ = from.j;
        } else if (Math.abs(dj) === 2 && di === 0) {
            midI = from.i;
            midJ = from.j + dj/2;
        }
        this.casillas[from.i][from.j] = 0;
        this.casillas[midI][midJ] = 0;
        this.casillas[to.i][to.j] = ficha;
        return true;
    }

    // Cuenta cuántas fichas quedan en el tablero
    countFichas() {
        let count = 0;
        for (let i = 0; i < this.casillas.length; i++) {
            for (let j = 0; j < this.casillas[i].length; j++) {
                if (this.casillas[i][j] instanceof Ficha) {
                    count++;
                }
            }
        }
        return count;
    }

    // Verifica si hay algún movimiento válido disponible
    hasValidMoves() {
        const rows = this.casillas.length;
        const cols = this.casillas[0].length;
        const dirs = [
            {di: -2, dj: 0}, // arriba
            {di: 2, dj: 0},  // abajo
            {di: 0, dj: -2}, // izquierda
            {di: 0, dj: 2}   // derecha
        ];
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.casillas[i][j] instanceof Ficha) {
                    for (const dir of dirs) {
                        const to = {i: i + dir.di, j: j + dir.dj};
                        if (to.i >= 0 && to.i < rows && to.j >= 0 && to.j < cols) {
                            if (this.validMove({i, j}, to)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    // Verifica el estado del juego: 'playing', 'won', 'lost'
    checkGameState() {
        const fichasRestantes = this.countFichas();
        
        if (fichasRestantes === 1) {
            // Verificar si la única ficha está en el centro
            const centerI = Math.floor(this.casillas.length / 2);
            const centerJ = Math.floor(this.casillas[0].length / 2);
            if (centerI && centerJ) {
                return 'won';
            } else {
                return 'lost';
            }
        }
        
        if (!this.hasValidMoves()) {
            return 'lost';
        }
        
        return 'playing';
    }

    render(ctx) {
        if (this.fondo.complete) {
            ctx.drawImage(this.fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            this.fondo.onload = () => {
                ctx.drawImage(this.fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
            };
        }
    }
}

//Temporizador
class Temporizador {
    constructor(duration, display) {
        this.duration = duration;
        this.display = display;
        this.startTime = null;
        this.running = false;
    }

    start() {
        this.startTime = performance.now();
        this.running = true;
        this.update();
    }

    format(msLeft) {
        const totalMs = Math.max(msLeft, 0);
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    }

    update = () => {
        if (!this.running) return;
        const now = performance.now();
        const elapsed = now - this.startTime;
        const remaining = this.duration - elapsed;
        this.display.textContent = this.format(remaining);
        if (remaining > 0) {
          requestAnimationFrame(this.update);
        } else {
          this.running = false;
          this.display.textContent = "00:00:00";
          alert("¡Tiempo terminado!");
        }
    }
}

// Fichas
class Ficha {
    render(ctx, x, y, size) {
        const cx = x + size/2;
        const cy = y + size/2;
        const radius = size*0.35;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        if (this.imagen && this.imagen.complete) {
            ctx.drawImage(this.imagen, cx - radius, cy - radius, radius*2, radius*2);
        } else if (this.imagen) {
            this.imagen.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(this.imagen, cx - radius, cy - radius, radius*2, radius*2);
                ctx.restore();
            };
        } else {
            ctx.fillStyle = 'rgba(132, 233, 221, 1)';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    }
}

class FichaAzul extends Ficha {
    constructor() {
        super();
        this.imagen = new window.Image();
        this.imagen.src = "../media/PegSolitarie/ej_ficha_azul.png";
    }
}

/*
class FichaRoja extends Ficha {
    constructor() {
        super();
        this.imagen = new window.Image();
        this.imagen.src = "../";
    }

}

class FichaAmarilla extends Ficha {
    constructor() {
        super();
        this.imagen = new window.Image();
        this.imagen.src = "../";
    }

}
    */

