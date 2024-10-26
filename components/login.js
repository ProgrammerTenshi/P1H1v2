// login.js
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Aquí puedes añadir tu lógica para validar el inicio de sesión
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Por ejemplo, verificar si el email y la contraseña son correctos
    if (email === "usuario@example.com" && password === "contraseña123") {
        // Redirigir a otra página si el inicio de sesión es exitoso
        window.location.href = "pagina-principal.html"; // Cambia esto a la página deseada
    } else {
        alert("Correo o contraseña incorrectos");
    }
});
