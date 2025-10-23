class Blocka {
    constructor(image) {
        
        let image = image;
    }

    //Getters y setters.

    //Event Listeners.

    //Métodos

}

let canvas = document.getElementById('GameCanvas');
let ctx = canvas.getContext("2d");
let width = 1000;
let height = 600;

canvas.width = width;
canvas.height = height;

canvas.style.background = "rgba(25, 24, 57, 1)";


//CLASES
class Circle {
    constructor(x, y, radio, color, text, speed){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        this.text = text;
        this.speed = speed; 

        this.dx = 1*this.speed;
        this.dy = 1*this.speed; 
    }

    draw(ctx){
        ctx.beginPath();
            //CIRCULO
            ctx.strokeStyle = this.color;
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.lineWidth = 10;
            ctx.arc(this.x, this.y, this.radio, 0, Math.PI*2);
            ctx.stroke();
            ctx.fill();

             //TEXTO
            ctx.fillStyle = this.color;
            ctx.font = "20px Arial";
                //Centrar el texto
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
            ctx.fillText(this.text, this.x, this.y);
        ctx.closePath();
    }

    update(){
        this.draw(ctx);

        //Cadad vez que choca el borde
        if ((this.x + this.radio) > width){
            this.dx = -this.dx;
        }
        if ((this.x - this.radio) < 0){
            this.dx = -this.dx;
        }
        if ((this.y + this.radio) > height){
            this.dy = -this.dy;
        }
        if ((this.y - this.radio) < 0){
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

let getDsitance = function(x1, y1, x2, y2){
    let result = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)) //Distancia ENTRE 2 PUNTOS
    return result;
}




//Creamos CIRCULO dinamicamente    
    //Itero Objeto
    let circle = new Circle(100, 800, 50, "rgba(236, 237, 244, 1)", "A", 5);
    let circle2 = new Circle(300, 300, 200, "rgba(236, 237, 244, 1)", "B", 0);

    circle.draw(ctx);
    circle2.draw(ctx);
    
//Modifico posición
    let updateCircle = function(){
        requestAnimationFrame(updateCircle);
        ctx.clearRect(0, 0, window_width, window_height);
        circle.update();
        circle2.update();

        //Collition detection
        if(getDsitance(circle.x, circle.y, circle2.x, circle2.y) < circle2.radio + circle.radio){
            circle2.color = "red";
        }

        if(getDsitance(circle.x, circle.y, circle2.x, circle2.y) >= circle2.radio + circle.radio){
            circle2.color = "rgba(236, 237, 244, 1)";
        }
    }

updateCircle();