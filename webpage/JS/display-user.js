// Este script se encarga de mostrar u ocultar elementos basados en el estado de autenticación.

// Referencias a elementos del DOM en el Header
const navProfileLink = document.getElementById('nav-profile-link');
const logoutBtn = document.getElementById('logout-btn');

// Referencias a los contenedores principales en account.html
const userDashboard = document.getElementById('user-dashboard');

// Referencias a campos dentro del Dashboard
const welcomeMessage = document.getElementById('welcome-message');
const dashboardName = document.getElementById('dashboard-name');
const dashboardEmail = document.getElementById('dashboard-email');

// ------------------------------------------------
// 1. FUNCIÓN DE ACTUALIZACIÓN DEL ESTADO (UI)
// ------------------------------------------------

function updateUI() {
    // Cerramos el widget de Netlify para limpiar el estado si está abierto
    netlifyIdentity.close();

    const user = netlifyIdentity.currentUser();

    if (user) {
        // --- USUARIO LOGUEADO: Mostrar Dashboard ---

        const userName = user.user_metadata.full_name || user.email.split('@')[0];

        // 1. Mostrar Dashboard
        if (userDashboard) userDashboard.style.display = 'block';

        // 2. Llenar los datos en el Dashboard
        if (welcomeMessage) welcomeMessage.innerHTML = `👋 ¡Bienvenido/a de vuelta, **${userName}**!`;
        if (dashboardName) dashboardName.textContent = userName;
        if (dashboardEmail) dashboardEmail.textContent = user.email;

        // 3. Actualizar Navegación
        if (navProfileLink) navProfileLink.innerHTML = `<b>Mi Perfil</b>`;
        if (logoutBtn) logoutBtn.style.display = 'inline-block';

    } else {
        // --- USUARIO DESCONECTADO: Abrir Widget de Netlify ---

        // 1. Ocultar Dashboard
        if (userDashboard) userDashboard.style.display = 'none';

        // 2. Abrir el Widget de Netlify (la única forma estable de acceder)
        netlifyIdentity.open();

        // 3. Restaurar Navegación
        if (navProfileLink) navProfileLink.innerHTML = '<b>Perfil</b>';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// ------------------------------------------------
// 2. LISTENERS DE NETLIFY IDENTITY
// ------------------------------------------------

netlifyIdentity.on('init', updateUI);
netlifyIdentity.on('login', updateUI);
netlifyIdentity.on('logout', updateUI);

// ------------------------------------------------
// 3. LOGOUT (Cerrar Sesión)
// ------------------------------------------------

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        netlifyIdentity.logout();

        // El retraso de 500ms es clave para evitar que los errores de carga reaparezcan al recargar
        setTimeout(() => {
            // Redireccionamos a la misma página
            window.location.href = window.location.href;
        }, 500);
    });
}