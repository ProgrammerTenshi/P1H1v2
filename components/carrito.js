const isAuthenticated = localStorage.getItem('isAuthenticated');

if (!isAuthenticated) {
    alert('Debes iniciar sesión para acceder al carrito.');
    window.location.href = '/Login.html'; // Redirige a la página de inicio de sesión
}

// Función para enviar los productos y generar la factura
async function generarFactura() {
    const productos = [
        { nombre: 'Producto 1', precio: 10 },
        { nombre: 'Producto 2', precio: 20 },
        // Agrega más productos seleccionados por el usuario
    ];

    const response = await fetch('http://localhost:3000/factura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar cookies de sesión
        body: JSON.stringify({ productos }),
    });

    const result = await response.json();
    if (result.success) {
        console.log("Factura generada:", result);
        mostrarFactura(result); // Llama a la función para mostrar la factura
    } else {
        console.error("Error al generar la factura:", result.message);
    }
}

// Función para mostrar la factura en la página
function mostrarFactura(data) {
    document.getElementById('nombre-usuario').textContent = `${data.user.nombre} ${data.user.apellido}`;
    document.getElementById('correo-usuario').textContent = data.user.correo;
    
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = ''; // Limpia la lista de productos

    data.productos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} - Precio: $${producto.precio}`;
        listaProductos.appendChild(li);
    });

    document.getElementById('precio-total').textContent = `$${data.precioTotal.toFixed(2)}`;
    document.getElementById('iva').textContent = `$${data.iva.toFixed(2)}`;
    document.getElementById('precio-total-con-iva').textContent = `$${data.precioTotalConIva.toFixed(2)}`;

    document.getElementById('factura').classList.remove('hidden'); // Muestra la factura
}
