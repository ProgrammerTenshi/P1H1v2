const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Configura la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cafeSolLuna',
    password: '123',
    port: 5432,
});

app.use(cors());
app.use(express.json());

// Ruta para login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Obtener el usuario de la base de datos
        const result = await pool.query('SELECT * FROM usuario ', [email]);
        const user = result.rows[0];

        if (user) {
            // Comparar la contraseña ingresada con la almacenada
            const match = await bcrypt.compare(password, user.contrasena);
            if (match) {
                // Generar un token JWT (opcional)
                const token = jwt.sign({ userId: user.idusuario }, 'tu_secreto', { expiresIn: '1h' });
                return res.status(200).json({ message: 'Login exitoso', token });
            }
        }
        
        res.status(401).json({ message: 'Credenciales incorrectas' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});