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
            const cellSize = 85;
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
                    ctx.strokeStyle = '#00fffbff';
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
        // Tablero clásico 7x7
        this.casillas = [
            [null, null, new FichaAzul(), new FichaRoja(), new FichaVioleta(), null, null],
            [null, null, new FichaAzul(), new FichaRoja(), new FichaVioleta(), null, null],
            [new FichaAzul(), new FichaRoja(), new FichaVioleta(), new FichaAzul(), new FichaRoja(), new FichaVioleta(), new FichaAzul()],
            [new FichaRoja(), new FichaVioleta(), new FichaAzul(), 0, new FichaRoja(), new FichaVioleta(), new FichaAzul()],
            [new FichaAzul(), new FichaRoja(), new FichaVioleta(), new FichaAzul(), new FichaRoja(), new FichaVioleta(), new FichaAzul()],
            [null, null, new FichaAzul(), new FichaRoja(), new FichaVioleta(), null, null],
            [null, null, new FichaAzul(), new FichaRoja(), new FichaVioleta(), null, null]
        ];
    }

    validMove(from, to) {
        if (!from || !to) return false;
        
        const ficha = this.casillas[from.i][from.j];
        if (!(ficha instanceof Ficha)) return false;
        if (this.casillas[to.i][to.j] !== 0) return false;
        
        const di = to.i - from.i;
        const dj = to.j - from.j;
        let mid1I, mid1J, mid2I, mid2J;
        
        // Saltos de 2 celdas (comer 1 ficha)
        if (Math.abs(di) === 2 && dj === 0) {
            mid1I = from.i + (di > 0 ? 1 : -1);
            mid1J = from.j;
            if (!(this.casillas[mid1I][mid1J] instanceof Ficha)) return false;
            return true;
        }
        
        if (Math.abs(dj) === 2 && di === 0) {
            mid1I = from.i;
            mid1J = from.j + (dj > 0 ? 1 : -1);
            if (!(this.casillas[mid1I][mid1J] instanceof Ficha)) return false;
            return true;
        }
        
        // Saltos de 3 celdas (comer 2 fichas)
        if (Math.abs(di) === 3 && dj === 0) {
            mid1I = from.i + (di > 0 ? 1 : -1);
            mid1J = from.j;
            mid2I = from.i + (di > 0 ? 2 : -2);
            mid2J = from.j;
            if (!(this.casillas[mid1I][mid1J] instanceof Ficha)) return false;
            if (!(this.casillas[mid2I][mid2J] instanceof Ficha)) return false;
            return true;
        }
        
        if (Math.abs(dj) === 3 && di === 0) {
            mid1I = from.i;
            mid1J = from.j + (dj > 0 ? 1 : -1);
            mid2I = from.i;
            mid2J = from.j + (dj > 0 ? 2 : -2);
            if (!(this.casillas[mid1I][mid1J] instanceof Ficha)) return false;
            if (!(this.casillas[mid2I][mid2J] instanceof Ficha)) return false;
            return true;
        }
        
        return false;
    }
    
   moveFicha(from, to) {
        if (!this.validMove(from, to)) return false;
        
        const ficha = this.casillas[from.i][from.j];
        const di = to.i - from.i;
        const dj = to.j - from.j;
        let mid1I, mid1J, mid2I, mid2J;
        
        // Saltos de 2 celdas (comer 1 ficha)
        if (Math.abs(di) === 2 && dj === 0) {
            mid1I = from.i + (di > 0 ? 1 : -1);
            mid1J = from.j;
            this.casillas[mid1I][mid1J] = 0; // Eliminar 1 ficha
        }
        
        if (Math.abs(dj) === 2 && di === 0) {
            mid1I = from.i;
            mid1J = from.j + (dj > 0 ? 1 : -1);
            this.casillas[mid1I][mid1J] = 0; // Eliminar 1 ficha
        }
        
        // Saltos de 3 celdas (comer 2 fichas)
        if (Math.abs(di) === 3 && dj === 0) {
            mid1I = from.i + (di > 0 ? 1 : -1);
            mid1J = from.j;
            mid2I = from.i + (di > 0 ? 2 : -2);
            mid2J = from.j;
            this.casillas[mid1I][mid1J] = 0; // Eliminar ficha 1
            this.casillas[mid2I][mid2J] = 0; // Eliminar ficha 2
        }
        if (Math.abs(dj) === 3 && di === 0) {
            mid1I = from.i;
            mid1J = from.j + (dj > 0 ? 1 : -1);
            mid2I = from.i;
            mid2J = from.j + (dj > 0 ? 2 : -2);
            this.casillas[mid1I][mid1J] = 0; // Eliminar ficha 1
            this.casillas[mid2I][mid2J] = 0; // Eliminar ficha 2
        }
        
        // Mover la ficha
        this.casillas[from.i][from.j] = 0;
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
        // Direcciones para saltos de 3 celdas
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
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.casillas[i][j] instanceof Ficha) {
                    for (const dir of dirs_1) {
                        const to = {i: i + dir.di, j: j + dir.dj};
                        if (to.i >= 0 && to.i < rows && to.j >= 0 && to.j < cols) {
                            if (this.validMove({i, j}, to)) {
                                return true;
                            }
                        }
                    }
                    for (const dir of dirs_2) {
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
            if (this.casillas[centerI][centerJ] instanceof Ficha) {
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

    pause() {
        this.running = false;
    }

    reset() {
        this.running = false;
        this.display.textContent = this.format(this.duration);
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
        } else { //Por las dudas de que se rompa la imagen
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

class FichaRoja extends Ficha {
    constructor() {
        super();
        this.imagen = new window.Image();
        this.imagen.src = "../media/PegSolitarie/fichaRoja.png";
    }

}

class FichaVioleta extends Ficha {
    constructor() {
        super();
        this.imagen = new window.Image();
        this.imagen.src = "../media/PegSolitarie/fichaVioleta.png" ;
    }
}


