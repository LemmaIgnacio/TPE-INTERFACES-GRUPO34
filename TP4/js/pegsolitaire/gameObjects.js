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
    constructor(duration, display, onFinish) {
        this.duration = duration;
        this.display = display;
        this.startTime = null;
        this.running = false;
        this.onFinish = typeof onFinish === 'function' ? onFinish : null;
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
            if (this.onFinish) this.onFinish();
        }
    }

    pause() {
        this.running = false;
    }

    reset() {
        this.running = false;
        this.display.textContent = this.format(this.duration);
    }
    setOnFinish(callback) {
        this.onFinish = typeof callback === 'function' ? callback : null;
    }

    //VIEW
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

//CLASE BUTTON
class Button {
    constructor(x, y, width, height, text, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.baseColor = color || 'rgba(210, 113, 243, 1)';
        this.hover = false;
        this.pressed = false;
        this.radius = 12;
        this.textColor = 'rgba(255, 255, 255, 1)';
    }

    isPointInside(mx, my){
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }

    drawRoundedRect(ctx, x, y, w, h, r){
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    draw(ctx){
        ctx.save();

        // Shadow
        ctx.shadowColor = 'rgba(252, 75, 255, 0.35)';
        ctx.shadowBlur = this.hover || this.pressed ? 20 : 10;
        ctx.shadowOffsetY = this.pressed ? 2 : 6;

        // Gradient background (slightly darker at bottom)
        const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        grad.addColorStop(0, this.baseColor);
        grad.addColorStop(1, 'rgba(249, 243, 250, 0.08)');

        // When hover or pressed, tint the gradient
        if (this.pressed) {
            // pressed = darker
            ctx.fillStyle = 'rgba(235, 138, 213, 1)';
        } else if (this.hover) {
            // hover = lighter tint
            ctx.fillStyle = 'rgba(172, 114, 238, 1)';
        } else {
            ctx.fillStyle = grad;
        }

        // Draw rounded rect
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        ctx.fill();

        // Outline
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.stroke();

        // Text
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = this.textColor;
        ctx.font = '20px Poppins, Helvetica';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const tx = this.x + this.width / 2;
        const ty = this.y + this.height / 2;
        ctx.fillText(this.text, tx, ty);

        ctx.restore();
    }

    // kept for compatibility in existing click handler
    clickBtn(mouseX, mouseY){
        if(this.isPointInside(mouseX, mouseY)){
            // visible feedback handled by pressed state in event listeners
            return true;
        }
        return false;
    }
}
//Efecto de BUTTON 
        // Hover / pressed handling for canvas buttons (redibuja cuando cambia)
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            let anyHover = false;

            if (btn_menu) {
                btn_menu.hover = btn_menu.isPointInside(mx, my);
                anyHover = anyHover || btn_menu.hover;
            }
            if (btn_next_level) {
                btn_next_level.hover = btn_next_level.isPointInside(mx, my);
                anyHover = anyHover || btn_next_level.hover;
            }

            canvas.style.cursor = anyHover ? 'pointer' : 'default';
            drawBlocka();
        });

        canvas.addEventListener('mouseleave', () => {
            if (btn_menu) { btn_menu.hover = false; btn_menu.pressed = false; }
            if (btn_next_level) { btn_next_level.hover = false; btn_next_level.pressed = false; }
            canvas.style.cursor = 'default';
            drawBlocka();
        });

        // Provide visual pressed feedback (doesn't replace your click handlers)
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            if (btn_menu && btn_menu.isPointInside(mx, my)) btn_menu.pressed = true;
            if (btn_next_level && btn_next_level.isPointInside(mx, my)) btn_next_level.pressed = true;
            drawBlocka();
        });

        canvas.addEventListener('mouseup', (e) => {
            if (btn_menu) btn_menu.pressed = false;
            if (btn_next_level) btn_next_level.pressed = false;
            drawBlocka();
        });

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

