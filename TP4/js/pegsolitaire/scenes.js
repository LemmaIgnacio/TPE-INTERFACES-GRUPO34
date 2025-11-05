class Scene {
    // Acciones que realiza la escena al inicializarse.
    init() {

    }

    // Actualiza contenido de la escena (Estado de botones, fichas, etc.)
    update() {

    }

    // Muestra el contenido de la escena dentro del canvas.
    render(ctx) {

    }

    // Elimina la escena. Se utilizaria antes de cambiar a otra escena.
    cleanup() {
        
    }
}

// Menú principal
class MenuScene extends Scene {

}

// Juego
class GameScene extends Scene {
    constructor() {
        super();
        // Instancia el tablero con imagen de fondo
        this.tablero = new Tablero('../media/pegsolitaire/board_bg.png');
        this.tablero.init();
    }

    render(ctx) {
        // Dibuja el fondo del tablero
        this.tablero.render(ctx);
        // Dibuja las casillas y fichas
        this.tablero.renderCasillas(ctx);
    }
}

// Juego terminado
class GameOverScene extends Scene {

}