document.addEventListener('DOMContentLoaded', function() {
    // Contenido del navbar con links y botón de Login
    const navbarContent = `
<header class="bg-amber-800 text-amber-50 p-4 fixed top-0 left-0 w-full z-10">
    <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Café Sol y Luna</h1>
        
        <!-- Menú de navegación (oculto en pantallas pequeñas) -->
        <nav id="navbar-menu" class="hidden md:flex md:items-center">
            <ul class="flex flex-col md:flex-row md:space-x-4 md:mr-4">
                <li><a href="#" data-page="Inicio.html" class="nav-link hover:text-amber-200">Inicio</a></li>
                <li><a href="#" data-page="Menu.html" class="nav-link hover:text-amber-200">Menú</a></li>
                <li><a href="#" data-page="Nosotros.html" class="nav-link hover:text-amber-200">Nosotros</a></li>
                <li><a href="#" data-page="Eventos.html" class="nav-link hover:text-amber-200">Eventos</a></li>
                <li><a href="#" data-page="Contacto.html" class="nav-link hover:text-amber-200">Contacto</a></li>
            </ul>
        </nav>

        <!-- Botón de hamburguesa y Login para pantallas pequeñas -->
        <div class="flex items-center space-x-2">
            <a href="#" data-page="Login.html" class="bg-amber-600 text-amber-50 px-4 py-2 rounded-md hover:bg-amber-700 transition duration-300">Login</a>
            <button id="menu-toggle" class="md:hidden focus:outline-none">
                <svg class="w-6 h-6 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
        </div>
    </div>
</header>
`;

    // Contenido del menú lateral para pantallas pequeñas
    const sidebarContent = `
<aside id="sidebar" class="fixed top-0 left-0 w-3/4 h-full bg-amber-800 text-amber-50 transform -translate-x-full transition-transform duration-300 ease-in-out z-20">
    <div class="p-4">
        
        <ul class="mt-6 space-y-4">
            <li><a href="#" data-page="Inicio.html" class="block nav-link hover:text-amber-200">Inicio</a></li>
            <li><a href="#" data-page="Menu.html" class="block nav-link hover:text-amber-200">Menú</a></li>
            <li><a href="#" data-page="Nosotros.html" class="block nav-link hover:text-amber-200">Nosotros</a></li>
            <li><a href="#" data-page="Eventos.html" class="block nav-link hover:text-amber-200">Eventos</a></li>
            <li><a href="#" data-page="Contacto.html" class="block nav-link hover:text-amber-200">Contacto</a></li>
        </ul>
    </div>
</aside>
`;

    // Contenido del footer
    const footerContent = `
    <footer class="bg-amber-800 text-amber-50 py-4">
        <div class="container mx-auto text-center">
            <p>&copy; 2024 Café Sol y Luna. Todos los derechos reservados.</p>
        </div>
    </footer>
    `;

    // Insertar navbar, sidebar y footer
    document.getElementById('navbar-container').innerHTML = navbarContent;
    document.body.insertAdjacentHTML('beforeend', sidebarContent); // Insertar el sidebar
    document.getElementById('footer-container').innerHTML = footerContent;

    // Añadir margen al contenedor de contenido
    document.getElementById('content-container').style.marginTop = '100px'; // Ajusta según la altura del navbar

    // Manejo de menú lateral en pantallas pequeñas
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Mostrar y ocultar el menú lateral al hacer clic en el botón de hamburguesa
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');  // Alternar mostrar/ocultar el menú lateral
    });

    // Función para cargar las páginas dinámicamente
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar la página");
                return response.text();
            })
            .then(html => {
                document.getElementById('content-container').innerHTML = html;
            })
            .catch(error => {
                document.getElementById('content-container').innerHTML = `<p class="text-center text-red-500">Hubo un problema al cargar la página.</p>`;
            });
    }

    // Asignar eventos a los enlaces del navbar y sidebar
    document.addEventListener('click', function(event) {
        const link = event.target.closest('[data-page]');
        if (link) {
            event.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
            sidebar.classList.add('-translate-x-full');  // Ocultar el sidebar al hacer clic en un enlace
        }
    });

    // Cargar la página inicial (Inicio.html) al inicio
    loadPage("Inicio.html");
});
