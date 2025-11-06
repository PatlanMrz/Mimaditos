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

// Agregar interactividad a los botones de productos
document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const productName = this.parentElement.querySelector('.product-title').textContent;
        alert(`¡${productName} agregado al carrito! 🛒`);
    });
});