export function loadSprite(path){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}


export function makeSprite(ctx, sprite, pos, scale = 1){
    return {
        width: sprite.width,
        height: sprite.height,
        pos,
        scale,
        draw(){
            //Usar valores redondeados para evitar bordes borrosos
            const x = Math.round(this.pos.x);
            const y = Math.round(this.pos.y);
            const w = Math.round(this.width * this.scale);
            const h = Math.round(this.height * this.scale);
            ctx.drawImage(sprite, x, y, w, h);
        }
    };
}

export function makeLayer(ctx, sprite, pos, scale = 1){
    return {
        head: makeSprite(ctx, sprite, pos, scale),
        tail: makeSprite(ctx, sprite, {x: pos.x + sprite.width * scale, y: pos.y}, scale),
        
    };
}

export function makeInfiniteScroll(dt, layer, speed){
    const headWidth = Math.round(layer.head.width * layer.head.scale);
    const tailWidth = Math.round(layer.tail.width * layer.tail.scale);
    
    //Mover ambas partes del layer
    layer.head.pos.x += speed * dt;
    layer.tail.pos.x += speed * dt;
    
    //Reposicionar cuando head va fuera de pantalla, manteniendo alineación exacta
    if(layer.head.pos.x + headWidth < 0){
        layer.head.pos.x = layer.tail.pos.x + tailWidth;
    }

    //Reposicionar cuando tail va fuera de pantalla, manteniendo alineación exacta
    if(layer.tail.pos.x + tailWidth < 0){
        layer.tail.pos.x = layer.head.pos.x + headWidth;
    }

    layer.head.draw();
    layer.tail.draw();
}