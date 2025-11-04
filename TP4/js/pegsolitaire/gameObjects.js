// Tablero
class Tablero {

    constructor() {
        let fondo = "";
        let casillas = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
    }

    // Cargaria las casillas con fichas y valores null para representar zonas donde no pueden existir fichas.
    init() {

    }

    // Verifica que el movimiento de ficha sea valido.
    validMove() {
        return null;
    }
}

// Temporizador
class Timer {
    constructor(X, Y, width, height, color) {
        this.x = X;
        this.y = Y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
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
    
}

class FichaAzul extends Ficha {
    constructor() {
        super();
        let imagen = "";
    }
}

class FichaRoja extends Ficha {

}

class FichaAmarilla extends Ficha {

}