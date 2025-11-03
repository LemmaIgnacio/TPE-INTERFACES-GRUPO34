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

}

// Juego terminado
class GameOverScene extends Scene {

}