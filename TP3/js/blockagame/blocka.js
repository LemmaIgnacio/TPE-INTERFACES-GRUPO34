let canvas = document.getElementById('GameCanvas');
let ctx = canvas.getContext("2d");
let width = 1000;
let height = 600;
const diffLevels = ['easy', 'medium', 'hard'];
let index_diff = 0;
let nextLevelActive = false;
let btn_next_level = null;
let gameFinished = false;

/*
document.getElementById('blocka-start-btn').addEventListener('click', function() {
    document.getElementById('difficulty-buttons').style.display = 'flex';
    this.style.display = 'none';
});
document.getElementById('btn-easy').addEventListener('click', function() {
    index_diff = 0;
    window.setBlockaDiff(diffLevels[index_diff]);
    if (img.complete) {
        drawBlocka();
        start();
    }
    document.getElementById('difficulty-buttons').style.display = 'none';
});
document.getElementById('btn-medium').addEventListener('click', function() {
    index_diff = 1;
    window.setBlockaDiff(diffLevels[index_diff]);
    if (img.complete) {
        drawBlocka();
        start();
    }
    document.getElementById('difficulty-buttons').style.display = 'none';
});
document.getElementById('btn-hard').addEventListener('click', function() {
    index_diff = 2;
    window.setBlockaDiff(diffLevels[index_diff]);
    if (img.complete) {
        drawBlocka();
        start();
    }
    document.getElementById('difficulty-buttons').style.display = 'none';
});*/

canvas.width = width;
canvas.height = height;



const filters = ['gray', 'glow', 'negative']

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


//Click nwxt level
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn_menu.clickBtn(x, y);
    if (nextLevelActive && btn_next_level) {

        // Check if btn_next_level button was clicked
        if ( x >= btn_next_level.x && x <= btn_next_level.x + btn_next_level.width && y >= btn_next_level.y && y <= btn_next_level.y + btn_next_level.height) {
            // Reset game state
            nextLevelActive = false;
            btn_next_level = null;
            if (index_diff < diffLevels.length - 1) {
                index_diff += 1;
                window.setBlockaDiff(diffLevels[index_diff]);
                //Carga una nueva imagen RANDOM
                const newImagePath = getRandomBlockaImage();
                img.src = newImagePath;
                img.onload = function() {
                    angles = [0,90,180,270].sort(() => Math.random() - 0.5);
                    drawBlocka();
                    reset(); //guarda el record si es el mejor y reinicia display
                    start();//Reinicia el cronometro
                };
            } else {
                gameFinished = true;
                drawBlocka();
            }
        }
    }
    if(btn_menu){
        // Check if menu button was clicked
        if (x >= btn_menu.x && x <= btn_menu.x + btn_menu.width &&
            y >= btn_menu.y && y <= btn_menu.y + btn_menu.height) {
            // Reset game state
            gameFinished = false;
            nextLevelActive = false;
            btn_next_level = null;
            index_diff = 0;
            
            // Show difficulty buttons and hide start button
            document.getElementById('blocka-menu').style.display = 'flex';
            document.getElementById('GameContainer').style.display = 'none';
            
            // Reset timer
            reset();
            
            // Redraw canvas
            drawBlocka();
            return;
        }
    }
});

let btn_menu = new Button (10, 10, 80, 50, 'MENU', 'rgba(132, 233, 221, 1)');

function createImage(ctx, imagePath, x, y, width, heigth){
    let myImage = document.createElement('img');
    myImage.src = imagePath;

    myImage.onload = function(){
        ctx.drawImage(myImage, x, y, width, heigth);
    }
}


const blockaImages = [
    '../media/blockaImages/1_Casas.png',
    '../media/blockaImages/2_RocaEnMedio.png',
    '../media/blockaImages/3_LagoBosqueMontania.png',
    '../media/blockaImages/4_OtroLagoBosqueMontania.png',
    '../media/blockaImages/5_MontaniaFlores.png',
    '../media/blockaImages/6_CampoFlores.png'
];

function getRandomBlockaImage(){
    const index = Math.floor(Math.random()* blockaImages.length);
    return blockaImages[index];
}





//---------------------------------------------------------------------------------------------------

const selectedImagePath = getRandomBlockaImage();
const img = new window.Image();
img.src = selectedImagePath;

let angles = [0,90,180,270].sort(() => Math.random() - 0.5);

const pieceW = 200;
const pieceH = 200;
const offsetX = 400;
const offsetY = 100;
const dest = [
    {x: offsetX, y: offsetY},{x: offsetX + pieceW, y: offsetY},
    {x: offsetX, y: offsetY + pieceH},{x: offsetX + pieceW, y: offsetY + pieceH}
];


img.onload = function() {
    drawBlocka();
    console.log(img.width, img.height)
};

function drawBlocka() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    btn_menu.draw(ctx);//Menu

    // Add level text
    ctx.save();
        ctx.font = '24px Poppins, Helvetica';
        ctx.fillStyle = 'rgba(153, 223, 238, 1)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${index_diff + 1}: ${diffLevels[index_diff]}`, canvas.width/2, 50);
        ctx.stroke();
    ctx.restore();


    if (nextLevelActive) {
        ctx.save();
            ctx.drawImage(img, offsetX, offsetY, pieceW*2, pieceH*2);
            ctx.font = '40px Poppins, Helvetica';
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.textAlign = 'center';
            ctx.fillText('🎉 Level Complete!', canvas.width/5, 120);
            ctx.font = '24px Poppins, Helvetica';
        ctx.restore();
        btn_next_level = new Button (850, 540, 140, 50, 'Siguiente nivel', 'rgba(132, 233, 221, 1)');
        btn_next_level.draw(ctx);
        return;
    }

    if (gameFinished) {
        ctx.save();
            ctx.drawImage(img, offsetX, offsetY, pieceW*2, pieceH*2);
            ctx.font = '40px Poppins, Helvetica';
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.textAlign = 'center';
            ctx.fillText('🎉 Congratulations!!', canvas.width/5, 120);
            ctx.fillText('All levels completed!', canvas.width/5.2, 190);
            ctx.font = '20px Poppins, Helvetica';
            ctx.fillText('Return to MENU to play again!', canvas.width/5.2, 260);
            ctx.font = '24px Poppins, Helvetica';
            reset();
        ctx.restore();
        return;
    }

    const coordinates = [
        {x: 0, y: 0},{x: img.width / 2, y: 0},
        {x: 0, y: img.height / 2},{x: img.width / 2, y: img.height / 2}
    ];
    for(let i = 0; i < 4; i++){
        ctx.save();
        const cx = dest[i].x + pieceW / 2;
        const cy = dest[i].y + pieceH / 2;
        ctx.translate(cx, cy);
        ctx.rotate((angles[i] * Math.PI)/180);
        let filter = getFilterByDiff(diffLevels[index_diff]);
        let pieceFilter;
        if(filter === 'gray'){
            pieceFilter = addGray(img, coordinates[i].x, coordinates[i].y, img.width/2, img.height/2);
        }else if(filter === 'glow'){
            pieceFilter = addGlow(img, coordinates[i].x, coordinates[i].y, img.width/2, img.height/2, 1.3);
        }else if (filter === 'negative'){
            pieceFilter = addNegative(img, coordinates[i].x, coordinates[i].y, img.width/2, img.height/2);
        }
        if (pieceFilter) {
            ctx.drawImage(pieceFilter, -pieceW/2, -pieceH/2, pieceW, pieceH);
        } else {
            ctx.drawImage(img, coordinates[i].x, coordinates[i].y, img.width/2, img.height/2, -pieceW/2, -pieceH/2, pieceW, pieceH);
        }
        ctx.restore();
    }
    if (nextLevelActive) {
        btn_next_level = new Button (850, 540, 140, 50, 'Siguiente nivel', 'rgba(132, 233, 221, 1)');
        btn_next_level.draw(ctx);
    }
}

canvas.addEventListener('contextmenu', function(e){
    e.preventDefault();
});

canvas.addEventListener('mousedown', function(e){ 
    if (gameFinished) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    for(let i = 0; i<4; i++){
        const x = dest[i].x;
        const y = dest[i].y;
        if(mouseX >= x && mouseX <= x + pieceW &&
            mouseY >= y && mouseY <= y + pieceH){
                if (e.button === 0) {//Click IZQUIERDO
                    angles[i] = (angles[i] - 90 + 360) % 360;
                } else if (e.button === 2) { //Click DERECHO
                    angles[i] = (angles[i] + 90) % 360;
                }
                drawBlocka();
                const resolved = angles.every(angle => angle % 360 == 0);
                if(resolved){
                    pause(); //pausa temporizador
                    nextLevelActive = true;
                    
                    drawBlocka();
                }
            }
    }
});


function getFilterByDiff(diff){
    if (diff === 'easy') return 'gray';
    if (diff === 'medium') return 'glow';
    if (diff === 'hard') return 'negative';
    return null;
}

function addGray(img, sx, sy, sw, sh) { 
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    let imageData = tempCtx.getImageData(0, 0, sw, sh);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = data[i+1] = data[i+2] = avg;
    }
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas;
}
    
function addGlow(img, sx, sy, sw, sh, factor = 3) { 
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    let imageData = tempCtx.getImageData(0, 0, sw, sh);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * factor + 125);
        data[i+1] = Math.min(255, data[i+1] * factor + 125);
        data[i+2] = Math.min(255, data[i+2] * factor + 125);
    }
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas;
}

function addNegative(img, sx, sy, sw, sh) { 
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    let imageData = tempCtx.getImageData(0, 0, sw, sh);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
    }
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas;
}
