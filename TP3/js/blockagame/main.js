//Ejecuta el juego blocka utilizando todas las clases. Incluir en blocka.html
import Blocka from "blocka.js";
import Level from "level.js";
import Tile from "tile.js";
import Menu from "menu.js";

class Main {
    constructor() {
        this.images = [];

        this.levels = [
            new Level(),
            new Level(),
            new Level()
        ];
    }

    async run() {
        this.images = await this.fetchImages();
    }

    async fetchImages() {
        // Implement actual image loading here; return empty array for now
        return [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.run();
})