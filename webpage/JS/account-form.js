// ==========================================================
// Lógica para ocultar el botón flotante de Netlify Identity
// ==========================================================

const identityWidget = document.querySelector('#netlify-identity-widget');

// Ocultamos el widget flotante de Netlify (el botón de la esquina)
if (identityWidget) {
    identityWidget.style.display = 'none';
}

// NOTA: El código de animación y de autenticación manual ha sido eliminado.