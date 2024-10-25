document.addEventListener('DOMContentLoaded', function() {
    const pages = {
        "Inicio": "Inicio.html",
        "Menu": "Menu.html",
        "Nosotros": "Nosotros.html",
        "Eventos": "Eventos.html",
        "Contacto": "Contacto.html",
        "Login": "Login.html"
    };

    const links = document.querySelectorAll('a[data-page]');
    const mainContent = document.getElementById('main-content');

    function loadPage(page) {
        const pageUrl = pages[page];
        if (pageUrl) {
            fetch(pageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: No se pudo cargar ${pageUrl}`);
                    }
                    return response.text();
                })
                .then(data => {
                    mainContent.innerHTML = data;
                })
                .catch(error => {
                    mainContent.innerHTML = '<p>Error al cargar la página. Por favor, intenta nuevamente.</p>';
                    console.error('Error al cargar la página:', error);
                });
        }
    }

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Cargar página de inicio por defecto
    loadPage('Inicio');
});
