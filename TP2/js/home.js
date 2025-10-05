"use strict";

const API_URL = 'https://vj.interfaces.jima.com.ar/api/v2';
const BACKUP_DATA_LOCATION = '../js/gameData.json';

// Función para cargar el carrusel y los cards de videojuego en la sección de carruseles
document.addEventListener('DOMContentLoaded', function() {
	(async () => {
		const gameCarouselsSection = document.getElementById('GameCarousels');
		if (!gameCarouselsSection) return;

		const gameList = await getApiData();
		console.log(gameList);

		for (let i = 0; i < gameList.length; i++) {
			loadCarousel(gameList[i], gameCarouselsSection);
		}	
	})();
});

// TODO: Completar la función loadCarousel para que cargue los datos en el HTML.
function loadCarousel(gameData, gameCarouselsSection) {
	const carouselHtml = localStorage.getItem('../html/home/gameCarousel.html');
	const cardHtml = localStorage.getItem('../html/home/gameCard.html');


}

async function getApiData() {
	try {
		const response = await fetch(API_URL);
		const data = await response.json();
		// Actualizar datos de respaldo			
		saveBackupData(data);
		return processApiData(data);
	} catch (error) {
		console.warn('No se pudieron cargar los datos de la API. Utilizando datos de respaldo:', error);
		return processApiData(loadBackupData());
	}
}

// Adaptar los datos obtenidos de la API para usar en el sitio.
function processApiData(JSONdata) {
    // Crear un objeto para agrupar por género
    const generos = {};

    JSONdata.forEach(game => {
        game.genres.forEach(genre => {
            if (!generos[genre.name]) {
                generos[genre.name] = [];
            }
            generos[genre.name].push({
                title: game.name,
                image: game.background_image_low_res
            });
        });
    });

    // Convertir el objeto a array con el formato deseado
    return Object.keys(generos).map(genreName => ({
        genre: genreName,
        games: generos[genreName]
    }));
}

// Guardar datos
function saveBackupData(data) {
    localStorage.setItem(BACKUP_DATA_LOCATION, JSON.stringify(data));
}

// Save backup data
function loadBackupData() {
    const gameData = localStorage.getItem(BACKUP_DATA_LOCATION);
    return datos ? JSON.parse(gameData) : null;
}