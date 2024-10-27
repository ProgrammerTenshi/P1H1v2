document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita la recarga de la página

    // Recoger datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log(result); // Para verificar la respuesta en la consola

  // Al realizar el inicio de sesión
  if (result.success) {
    console.log("Nombre de usuario recibido:", result.username); // Verifica el nombre completo
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', result.username); // Guarda el nombre completo
    window.location.href = '/Carrito.html'; 
} else {
            // Mostrar mensaje de error
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = result.message; // Mensaje del servidor
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
    }
});
