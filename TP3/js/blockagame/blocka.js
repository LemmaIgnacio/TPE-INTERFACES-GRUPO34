let canvas = document.getElementById('GameCanvas');
let ctx = canvas.getContext("2d");
let width = 1000;
let height = 600;
const diffLevels = ['easy', 'medium', 'hard'];
let index_diff = 0;
let nextLevelActive = false;
let btn_next_level = null;
let gameFinished = false;

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
});

canvas.width = width;
canvas.height = height;

canvas.style.background = "rgba(25, 24, 57, 1)";

const filters = ['gray', 'glow', 'negative']

//CLASE BUTTON
class Button {
  constructor(x, y, width, height, text, color){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;         
    this.color = color;
  }

  draw(ctx){
    ctx.beginPath();
      // Botones
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = 'rgba(18, 14, 38, 1)';
      ctx.font = '20px Poppins, Helvetica';
      //Centrar el texto
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 
      ctx.fillText(this.text, this.x + this.width / 2, this.y + 32);
      ctx.fill();
      ctx.stroke();
    ctx.closePath();
  }

    clickBtn(mouseX, mouseY){
        if(mouseX >= this.x && mouseX <= this.x+this.width && mouseY >= this.y && mouseY <= this.y+this.height){
            ctx.fillStyle = 'rgba(132, 51, 120, 1)';
            ctx.fill();
        }       
    }
}

//Click nwxt level
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn_menu.clickBtn(x, y);
    if (nextLevelActive && btn_next_level) {
        if (
            x >= btn_next_level.x && x <= btn_next_level.x + btn_next_level.width &&
            y >= btn_next_level.y && y <= btn_next_level.y + btn_next_level.height
        ) {
            nextLevelActive = false;
            btn_next_level = null;
            if (index_diff < diffLevels.length - 1) {
                index_diff += 1;
                window.setBlockaDiff(diffLevels[index_diff]);
                angles = [0,90,180,270].sort(() => Math.random() - 0.5);
                drawBlocka();
                start();
            } else {
                gameFinished = true;
                drawBlocka();
            }
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
        ctx.fillStyle = 'rgba(132, 233, 221, 1)';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${index_diff + 1}`, canvas.width/2, 50);
    ctx.restore();


    if (gameFinished) {
        ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.globalAlpha = 1;
            ctx.drawImage(img, offsetX, offsetY, pieceW*2, pieceH*2);
            ctx.font = '40px Poppins, Helvetica';
            ctx.fillStyle = 'rgba(132, 233, 221, 1)';
            ctx.textAlign = 'center';
            ctx.fillText('¡Felicitaciones! Completaste todos los niveles.', canvas.width/2, 80);
            ctx.font = '24px Poppins, Helvetica';
            ctx.fillText('Haz clic en MENU para volver.', canvas.width/2, 130);
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
                    reset(); //guarda el record si es el mejor y reinicia display
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

function addGray(img, sx, sy, sw, sh) { //refactor x ia
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
    
function addGlow(img, sx, sy, sw, sh, factor = 3) { //refactor x ia
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

function addNegative(img, sx, sy, sw, sh) { //refactor x ia
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
