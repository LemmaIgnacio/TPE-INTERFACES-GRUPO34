
let canvas = document.getElementById('GameCanvas');
let ctx = canvas.getContext("2d");
let width = 1000;
let height = 600;

canvas.width = width;
canvas.height = height;

canvas.style.background = "rgba(25, 24, 57, 1)";

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
        ctx.textBaseline = "center";
      ctx.fillText(this.text, this.x + this.width / 2, this.y + 32);
      ctx.fill();
      ctx.stroke();
    ctx.closePath();
  }
}

let btn_menu = new Button (10, 10, 80, 50, 'MENU', 'rgba(132, 233, 221, 1)');
btn_menu.draw(ctx);

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

//Itero Imagen
    let image = new Image (getRandomBlockaImage(), 400, 250, 200, 200);
    //Creo la Imagen en pantalla.
    createImage(ctx, image.imagePath, image.x, image.y, image.width, image.height);

console.log(getRandomBlockaImage());
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
        ctx.drawImage(img, coordinates[i].x, coordinates[i].y, img.width/2, img.height/2,-pieceW/2, -pieceH/2, pieceW, pieceH );
        ctx.restore();
    }
}

canvas.addEventListener('contextmenu', function(e){
    e.preventDefault();
});

canvas.addEventListener('mousedown', function(e){
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for(let i = 0; i<4; i++){
        const x = dest[i].x;
        const y = dest[i].y;
        if(mouseX >= x && mouseX <= x + pieceW &&
            mouseY >= y && mouseY <= y + pieceH){
                if (e.button === 0) {
                    angles[i] = (angles[i] - 90 + 360) % 360;
                } else if (e.button === 2) {
                    angles[i] = (angles[i] + 90) % 360;
                }
                drawBlocka();
                break;
            }
    }
});
    

