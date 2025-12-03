// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.slideInterval = null;

        this.init();
    }

    init() {
        // Event listeners para botones
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-play
        this.startAutoPlay();

        // Pausar auto-play al interactuar
        this.pauseOnHover();
    }

    showSlide(index) {
        // Remover clase active de todos los slides e indicadores
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Agregar clase active al slide e indicador actual
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) {
            next = 0;
        }
        this.showSlide(next);
        this.restartAutoPlay();
    }

    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) {
            prev = this.slides.length - 1;
        }
        this.showSlide(prev);
        this.restartAutoPlay();
    }

    goToSlide(index) {
        this.showSlide(index);
        this.restartAutoPlay();
    }

    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Cambia cada 5 segundos
    }

    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    stopAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }

    pauseOnHover() {
        const carousel = document.querySelector('.hero-carousel');

        carousel.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        carousel.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    new Carousel();
});