class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
    }

    add(name, scene) {
        this.scenes[name] = scene;
    }

    switchTo(name) {
        if (this.currentScene) {
            this.currentScene.cleanup();
        }

        this.currentScene = this.scenes[name];
        this.currentScene.init();    
    }

    update() {
        if (this.currentScene) {
            this.currentScene.update();
        }
    }

    render(ctx) {
        if (this.currentScene) {
            this.currentScene.render(ctx);
        }
    }
}