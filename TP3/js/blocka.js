//POWER POINT CHALLENGE
    let challenge = document.getElementById('GameCanvas');
    let ctxch = challenge.getContext("2d");
        //Dibujar MUÑECO DE NIEVE
        //CUERPO
        ctxch.beginPath();//Inicia un nuevo trazo
            ctxch.fillStyle = "rgba(255, 255, 255, 1)"; //Color de relleno en formato RGBA
            ctxch.arc(150, 150, 50, 0, Math.PI * 2); //Dibuja un circulo (x, y, radio, angulo inicio, angulo fin)
            ctxch.arc(150, 100, 35, 0, Math.PI * 2);
            ctxch.arc(150, 60, 20, 0, Math.PI * 2);
            ctxch.fill(); //Rellena la figura

        //OJOS
        ctxch.beginPath();//Inicia un nuevo trazo            
            ctxch.fillStyle = "rgba(0, 0, 0, 1)"; //Color de relleno en formato RGBA
            ctxch.arc(155, 50, 3, 0, Math.PI * 2);
            ctxch.arc(145, 50, 3, 0, Math.PI * 2); //Dibuja un circulo (x, y, radio, angulo inicio, angulo fin)
            ctxch.fill(); //Dibuja la linea
        
        //BOCA
        ctxch.beginPath();//Inicia un nuevo trazo
            ctxch.lineWidth = 3;
            ctxch.arc(150, 58, 7, 0, Math.PI); //Dibuja un arco (x, y, radio, angulo inicio, angulo fin)
            ctxch.strokeStyle = "rgba(0, 0, 0, 1)";
            ctxch.stroke(); //Dibuja la linea
        
        //NARIZ
        ctxch.beginPath();//Inicia un nuevo trazo
            ctxch.fillStyle = "rgba(255, 165, 0, 1)"; //Color de relleno en formato RGBA
            ctxch.moveTo(150, 58);//Mueve el cursor a la posición (x,y)
            ctxch.lineTo(170, 56);
            ctxch.lineTo(150, 54);
            ctxch.fill(); //Rellena la figura
        
        //BOTONES
        ctxch.beginPath();//Inicia un nuevo trazo
            ctxch.fillStyle = 'rgba(110, 76, 75, 1)'; //Color de relleno en formato RGBA
            ctxch.arc(150, 80, 4, 0, Math.PI*2);
            ctxch.arc(150, 95, 4, 0, Math.PI*2);
            ctxch.arc(150, 110, 4, 0, Math.PI*2);
            ctxch.fill(); //Rellena la figura

        //BRAZOS
        ctxch.beginPath();//Inicia un nuevo trazo
            ctxch.lineWidth = 5;
            ctxch.moveTo(120, 95);//Mueve el cursor a la posición (x,y)
            ctxch.lineTo(80, 80);
            ctxch.moveTo(180, 95);
            ctxch.lineTo(220, 80);

            //DEDOS
            ctxch.moveTo(80, 80);
            ctxch.lineTo(70, 70);
            ctxch.moveTo(80, 80);
            ctxch.lineTo(75, 90);
            ctxch.moveTo(220, 80);
            ctxch.lineTo(230, 70);
            ctxch.moveTo(220, 80);
            ctxch.lineTo(215, 90);

            ctxch.strokeStyle = "rgba(110, 76, 75, 1)";
            ctxch.stroke(); //Dibuja la linea
