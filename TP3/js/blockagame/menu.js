document.addEventListener('DOMContentLoaded', function() {


    const howtoBtn = document.getElementById('blocka-howto-btn');
    const howtoModal = document.getElementById('howto-modal');
    const closeHowto = document.getElementById('close-howto');

    if (howtoBtn && howtoModal && closeHowto) {
        howtoBtn.addEventListener('click', function() {
            howtoModal.classList.add('active');
        });
        closeHowto.addEventListener('click', function() {
            howtoModal.classList.remove('active');
        });
        howtoModal.addEventListener('click', function(e) {
            if (e.target === howtoModal) {
                howtoModal.classList.remove('active');
            }
        });
    }
});

const galleryBtn = document.getElementById('blocka-gallery-btn');
const galleryModal = document.getElementById('gallery-modal');
const closeGallery = document.getElementById('close-gallery');

if (galleryBtn && galleryModal && closeGallery) {
    galleryBtn.addEventListener('click', function() {
        galleryModal.classList.add('active');
    });
    closeGallery.addEventListener('click', function() {
        galleryModal.classList.remove('active');
    });
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            galleryModal.classList.remove('active');
        }
    });
}

const galleryImages = [
    {
        src: '../media/blockaImages/1_Casas.png',
        alt: 'Gallery image 1: Houses'
    },
    {
        src: '../media/blockaImages/2_RocaEnMedio.png',
        alt: 'Gallery image 2: Rock in the middle'
    },
    {
        src: '../media/blockaImages/3_LagoBosqueMontania.png',
        alt: 'Gallery image 3: Lake, forest and mountain'
    },
    {
        src: '../media/blockaImages/4_OtroLagoBosqueMontania.png',
        alt: 'Gallery image 4: Another lake, forest and mountain'
    },
    {
        src: '../media/blockaImages/5_MontaniaFlores.png',
        alt: 'Gallery image 5: Mountain and flowers'
    },
    {
        src: '../media/blockaImages/6_CampoFlores.png',
        alt: 'Gallery image 6: Field and flowers'
    }
];

const galleryImagesContainer = document.getElementById('blocka-gallery-images');
if (galleryImagesContainer) {
    galleryImages.forEach(img => {
        const card = document.createElement('div');
        card.className = 'blocka-gallery-card';
        const image = document.createElement('img');
        image.src = img.src;
        image.alt = img.alt;
        card.appendChild(image);
        galleryImagesContainer.appendChild(card);
    });
}

class Menu {
    constructor() {
        
    }
}








