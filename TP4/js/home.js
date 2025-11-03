"use strict";

const GAME_GENRES = ['Puzzle', 'Adventure', 'RPG', 'Shooter'];
const API_URL = 'https://vj.interfaces.jima.com.ar/api/v2';
const BACKUP_DATA_LOCATION = '../js/gameData.json';


// 3.Al cargar la Home se debe ejecutar siempre un loading simulado de 5 segundos, 
// el cual NO puede ser un GIF. El mismo debe mostrar un % de avance 
// y una animación de carga (cuadrado, círculo, spinner)
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader-overlay");
    const percent = document.getElementById("loader-percent");
    let progress = 0;
    const duration = 5000; // 5 seconds
    const interval = 50;
    const step = 100 / (duration / interval);

    loader.style.display = "flex";
    percent.textContent = "0%";

    const timer = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            loader.style.display = "none";
        }
        percent.textContent = `${Math.floor(progress)}%`;
    }, interval);
});

document.addEventListener('DOMContentLoaded', function() {	
    // Cargar los datos de la API y luego cargar los carruseles y la sección de juegos recientemente jugados.
    (async () => {
		const gameCarouselsSection = document.getElementById('GameCarousels');
		if (!gameCarouselsSection) return;

		const gameList = await getApiData();

        // Cargar los juegos recientemente jugados
        for (let i = 0; i < GAME_GENRES.length; i++) {
            if(!gameList.find(g => g.genre === GAME_GENRES[i])) continue;
            loadRecentGame(gameList[i].games);
        }

		// Cargar los carruseles de juegos por género.
        for (let i = 0; i < gameList.length; i++) {
            if(!GAME_GENRES.includes(gameList[i].genre)) continue;
			loadCarousel(gameList[i], gameCarouselsSection);
		}
	})();
});


async function loadRecentGame(gameList) {
    try {
        const recentGameHtml = await fetch('../html/home/recentGameCard.html').then(res => res.text());
        const recentGameCards = document.querySelector('.recent-game-cards');
        if (!recentGameCards) return;
        const recentGame = createElementFromString(recentGameHtml);
        recentGame.querySelector('.recent-game-card__image').src = gameList[1].image;
        recentGameCards.appendChild(recentGame);
    }   catch (error) {
        console.error('Error cargando la plantilla de juego reciente:', error);
    }
}

async function loadCarousel(gameData, gameCarouselsSection) {
    try {
        const carouselHtml = await fetch('../html/home/gameCarousel.html').then(res => res.text());
        const cardHtml = await fetch('../html/home/gameCard.html').then(res => res.text());

        // Crear el carrusel y agregarlo a la sección
        const carousel = createElementFromString(carouselHtml);
        carousel.querySelector('.carousel-title').textContent = gameData.genre;

        // Añadir una card de Peg Solitaire si el género es Puzzle
        if (gameData.genre === 'Puzzle') {
            const card = createElementFromString(cardHtml);
            card.querySelector('.game-card__title').textContent = "Dragon Peg Solitaire";
            card.querySelector('.game-card__image').src = "../media/PegSolitaire 1.png";
            card.querySelector('a').href = "../html/game.html";
            carousel.querySelector('.carousel-track').innerHTML += card.outerHTML;
        }

        // Agregar las cards de juegos al carrusel
        for (let i = 0; i < gameData.games.length; i++) {
            const card = createElementFromString(cardHtml);
            card.querySelector('.game-card__title').textContent = gameData.games[i].title;
            card.querySelector('.game-card__image').src = gameData.games[i].image;
            carousel.querySelector('.carousel-track').innerHTML += card.outerHTML;
        }
        gameCarouselsSection.appendChild(carousel);

        // Animación onclick para los botones del carrusel
        const btnLeft = carousel.querySelector('.carousel-button-left');
        const btnRight = carousel.querySelector('.carousel-button-right');
        const carouselTrack = carousel.querySelector('.carousel-track');
        const scrollStep = 1350; // ancho aproximado de una card + margen

        function updateButtonsVisibility() {
            // Oculta ambos botones en pantallas pequeñas
            if (window.innerWidth <= 768) {
                if (btnLeft) btnLeft.style.display = 'none';
                if (btnRight) btnRight.style.display = 'none';
            } else {
                // Oculta el botón izquierdo si está al inicio
                if (btnLeft) {
                    btnLeft.style.display = carouselTrack.scrollLeft <= 0 ? 'none' : 'block';
                }
                // Oculta el botón derecho si está al final
                if (btnRight) {
                    const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
                    btnRight.style.display = carouselTrack.scrollLeft >= maxScroll - 1 ? 'none' : 'block';
                }
            }
        }
        
        updateButtonsVisibility();

        window.addEventListener('resize', updateButtonsVisibility);
        
        if (btnLeft && carouselTrack) {
            btnLeft.addEventListener('click', () => {
                carouselTrack.classList.add('skew-left');
                carouselTrack.scrollBy({
                    left: -scrollStep,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    carouselTrack.classList.remove('skew-left');
                    updateButtonsVisibility();
                }, 200);
            });
        }
        if (btnRight && carouselTrack) {
            btnRight.addEventListener('click', () => {
                carouselTrack.classList.add('skew-right');
                carouselTrack.scrollBy({
                    left: scrollStep,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    carouselTrack.classList.remove('skew-right');
                    updateButtonsVisibility();
                }, 200);
            });
        }

        let isDragging = false;
        let scrollStart = 0;
        let startX = 0;

        // Touch events para móvil
        carouselTrack.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollStart = carouselTrack.scrollLeft;
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const x = e.touches[0].pageX;
            const walk = (startX - x) * 1.5; // Multiplicador para sensibilidad
            carouselTrack.scrollLeft = scrollStart + walk;
        });

        carouselTrack.addEventListener('touchend', () => {
            isDragging = false;
        });        

    } catch (error) {
        console.error('Error cargando las plantillas:', error);
    }
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

// Crear un elemento DOM a partir de una cadena HTML.
function createElementFromString(htmlString) {
    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString.trim(); // Trim to avoid unwanted whitespace

    // Return the first child element
    return tempDiv.firstElementChild;
}

