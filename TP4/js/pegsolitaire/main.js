// Creación y setup del gestor de escenas.
const sceneManager = new SceneManager();
sceneManager.add("main_menu", new MenuScene());
sceneManager.add("game", new GameScene());
sceneManager.add("game_over", new GameOverScene());

// Empezar juego en menú principal.
sceneManager.switchTo("main_menu");

// Game loop
function gameLoop() {
    sceneManager.update();
    sceneManager.render(ctx);

    requestAnimationFrame(gameLoop);
}

