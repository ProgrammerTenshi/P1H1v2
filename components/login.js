document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log(result); // For debugging

        if (result.success) {
            console.log("Nombre de usuario recibido:", result.username);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', result.username);
            window.location.href = '/Carrito.html';
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = result.message;
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
    }
});