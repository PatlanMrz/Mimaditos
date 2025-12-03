// =======================================================
// === LÓGICA DEL CARRITO BASADA EN LOCALSTORAGE (CART.JS) ===
// =======================================================

// 1. FUNCIONES PRINCIPALES DE GESTIÓN DE DATOS
// --------------------------------------------------------

/** Obtiene el carrito del localStorage o devuelve un array vacío si no existe. */
function getCart() {
    const cart = localStorage.getItem('mimaditosCart');
    // Siempre devuelve un array para evitar errores.
    return cart ? JSON.parse(cart) : [];
}

/** Guarda el carrito actualizado en el localStorage. */
function saveCart(cart) {
    localStorage.setItem('mimaditosCart', JSON.stringify(cart));
}

/** Obtiene la información del producto a partir del botón (debes pasarle el botón) */
function getProductData(button) {
    // Subir hasta encontrar el contenedor principal de la tarjeta de producto
    const card = button.closest('.product-card') || button.closest('.detail-card');

    if (!card) return null;

    // Usamos el título del producto como ID ÚNICO
    const id = card.querySelector('.product-title, .detail-title').textContent.trim();
    const name = id;

    // Obtener y parsear el precio
    const priceText = card.querySelector('.product-price, .detail-price').textContent;
    const priceMatch = priceText.match(/\$([\d,.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

    // Obtenemos la ruta de la imagen
    const image = card.querySelector('.product-img, .detail-main-img').getAttribute('src');

    return { id, name, price, image };
}

// 2. LÓGICA DE INTERFAZ Y NOTIFICACIONES
// --------------------------------------------------------

/** Muestra un banner de notificación en la interfaz. */
function showNotification(message) {
    const banner = document.getElementById('notification-banner');
    const msgElement = document.getElementById('notification-message');

    if (banner && msgElement) {
        // 1. Poner el mensaje
        msgElement.textContent = message;

        // 2. Mostrar el banner
        banner.classList.add('show');

        // 3. Ocultar automáticamente después de 4 segundos
        setTimeout(() => {
            banner.classList.remove('show');
        }, 4000);
    }
}

/** Agrega o actualiza un producto en el carrito y muestra la notificación. */
function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        // Si el producto ya existe, solo incrementa la cantidad
        existingItem.quantity += 1;
    } else {
        // Si es un producto nuevo, lo agrega
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    console.log('Producto agregado al carrito:', product.name);

    // Llamar a la función de banner
    showNotification(`El producto ha sido añadido a tu carrito!`);
}


// 3. LÓGICA PARA RENDERIZAR LA PÁGINA DEL CARRITO (cart.html)
// ------------------------------------------------------------

function renderCartPage() {
    const cart = getCart();
    const cartListContainer = document.querySelector('.cart-items-list');
    const summaryContainer = document.querySelector('.cart-summary');

    if (!cartListContainer || !summaryContainer) return;

    cartListContainer.innerHTML = ''; // Limpiar la lista actual
    let subtotal = 0;

    if (cart.length === 0) {
        cartListContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío. ¡Explora nuestros productos y encuentra a tu Mimadito favorito!</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            // Determinar categoría (simple basado en el nombre, o podrías agregar un campo "pet" al objeto producto)
            const petCategory = item.name.toLowerCase().includes('pollo') || item.name.toLowerCase().includes('atún') || item.name.toLowerCase().includes('pescado') ? 'Para Mininos' : 'Para Caninos';

            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}" class="item-img">
                    </div>
                    <div class="item-details">
                        <h2 class="item-title">${item.name}</h2>
                        <p class="item-pet">${petCategory}</p>
                        <p class="item-price-unit">$${item.price.toFixed(2)} MXN / u</p>
                    </div>
                    <div class="item-quantity">
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    </div>
                    <div class="item-subtotal">
                        $${itemTotal.toFixed(2)} MXN
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">✕</button>
                </div>
            `;
            cartListContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    }

    // Re-añadir el botón de continuar comprando
    cartListContainer.insertAdjacentHTML('beforeend', `<a href="/HTML/productos.html" class="continue-shopping">← Continuar Comprando</a>`);

    // Actualizar el resumen
    updateSummary(subtotal, cart.length);

    // Re-añadir listeners para los botones de eliminar y el input de cantidad
    addCartListeners();
}

function updateSummary(subtotal, itemCount) {
    const summaryTotalElement = document.querySelector('.summary-total .total-price');
    const subtotalElement = document.querySelector('.summary-line:nth-child(1) span:last-child');
    const subtotalTextElement = document.querySelector('.summary-line:nth-child(1) span:first-child');
    const checkoutButton = document.querySelector('.checkout-btn');

    if (!subtotalElement || !summaryTotalElement || !subtotalTextElement || !checkoutButton) return;

    subtotalElement.textContent = `$${subtotal.toFixed(2)} MXN`;
    summaryTotalElement.textContent = `$${subtotal.toFixed(2)} MXN`;
    subtotalTextElement.textContent = `Subtotal (${itemCount} productos)`;

    // Habilitar/Deshabilitar el botón de compra
    if (itemCount === 0) {
        checkoutButton.disabled = true;
        checkoutButton.textContent = 'Carrito Vacío';
    } else {
        checkoutButton.disabled = false;
        checkoutButton.textContent = 'Finalizar Compra';
    }
}


// 4. LÓGICA PARA MANEJAR CAMBIOS EN EL CARRITO (Página cart.html)
// --------------------------------------------------------------

function addCartListeners() {
    // 4.1 Listener para eliminar producto
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const idToRemove = e.currentTarget.dataset.id;
            let cart = getCart();
            cart = cart.filter(item => item.id !== idToRemove);
            saveCart(cart);
            renderCartPage(); // Volver a renderizar
        });
    });

    // 4.2 Listener para cambiar cantidad
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const idToUpdate = e.currentTarget.dataset.id;
            const newQuantity = parseInt(e.currentTarget.value);

            if (newQuantity < 1 || isNaN(newQuantity)) {
                // Si la cantidad es 0 o menos, o no es un número válido, eliminar el producto
                let cart = getCart();
                cart = cart.filter(item => item.id !== idToUpdate);
                saveCart(cart);
                renderCartPage();
            } else {
                let cart = getCart();
                const item = cart.find(item => item.id === idToUpdate);
                if (item) {
                    item.quantity = newQuantity;
                    saveCart(cart);
                    renderCartPage();
                }
            }
        });
    });
}


// 5. INICIALIZACIÓN: ESCUCHA DE EVENTOS GLOBAL
// --------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Escucha clics en todos los botones de "Agregar al Carrito"
    document.querySelectorAll('.add-to-cart-btn, .product-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = getProductData(e.currentTarget);
            if (product && product.price > 0) {
                addToCart(product);
            } else {
                console.error("No se pudo obtener la información completa del producto.");
            }
        });
    });

    // Escucha el botón de cerrar en el banner de notificación
    const closeBtn = document.querySelector('.close-notification-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const banner = document.getElementById('notification-banner');
            if (banner) {
                banner.classList.remove('show');
            }
        });
    }

    // Si estamos en la página del carrito, renderizar el contenido
    if (document.querySelector('.cart-page-container')) {
        renderCartPage();
    }
});