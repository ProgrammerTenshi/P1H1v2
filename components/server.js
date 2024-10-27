const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
import express from 'express'

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

    // app.get('/usuario', async (req, res) => {
    //     try {
    //         console.log("Intentando obtener usuarios de la base de datos...");
    //         const result = await pool.query('SELECT * FROM usuario');
    //         console.log("Usuarios obtenidos:", result.rows);
    //         res.json(result.rows);
    //     } catch (error) {
    //         console.error('Error al obtener usuarios de la base de datos:', error);
    //         res.status(500).json({ success: false, message: "Error en el servidor" });
    //     }
    // });

// Obtener el nombre del usuario de la sesión
app.get('/usuario', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: "No autenticado" });
    }
});

// Endpoint para obtener productos
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});



// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuario WHERE c_electronico = $1 AND contrasena = $2', [email, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            req.session.user = user;
            
            const fullName = `${user.nombre} ${user.apellido}`;
            res.json({ success: true, username: fullName });
        } else {
            res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});




// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
        }
        res.json({ success: true, message: "Sesión cerrada con éxito" });
    });
});


// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.session.user) { // Asumiendo que guardas el usuario en la sesión
        return next();
    }
    res.status(401).json({ success: false, message: 'No autenticado' });
}

// Ruta protegida para el carrito
app.get('/carrito', isAuthenticated, (req, res) => {
    // Aquí va la lógica para mostrar el carrito
    const carrito = []; // Aquí debes obtener el carrito del usuario
    res.json({ success: true, data: carrito }); // Enviar el carrito al cliente
});

// Updated endpoint for generating invoices
app.post('/generarFactura', async (req, res) => {
    const { usuario, productos, totalConIVA } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Fetch user details from the database
        const userResult = await client.query('SELECT * FROM usuario WHERE nombre = $1', [usuario.split(' ')[0]]);
        
        if (userResult.rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        const user = userResult.rows[0];

        // Calculate totals
        const subtotal = productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        const iva = subtotal * 0.12; // 12% IVA
        const total = subtotal + iva;

        // Generate invoice number
        const invoiceNumber = Date.now();

        // Insert invoice into the database
        const insertInvoiceQuery = `
            INSERT INTO facturas (numero_factura, fecha, idusuario, subtotal, iva, total)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING idfacturas
        `;
        const invoiceResult = await client.query(insertInvoiceQuery, [
            invoiceNumber,
            new Date(),
            user.idusuario,
            subtotal,
            iva,
            total
        ]);

        const facturaId = invoiceResult.rows[0].idfacturas;

        // Insert invoice details and update product quantities
        for (const producto of productos) {
            // Insert invoice detail
            const insertDetailQuery = `
                INSERT INTO detalle_factura (idfacturas, idproducto, cantidad, precio_unitario)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(insertDetailQuery, [facturaId, producto.idproducto, producto.cantidad, producto.precio]);

            // Update product quantity
            const updateProductQuery = `
                UPDATE productos
                SET stock = stock - $1
                WHERE idproducto = $2
            `;
            await client.query(updateProductQuery, [producto.cantidad, producto.idproducto]);
        }

        await client.query('COMMIT');

        const invoice = {
            numeroFactura: invoiceNumber,
            fecha: new Date().toISOString(),
            usuario: {
                nombre: user.nombre,
                apellido: user.apellido,
                c_electronico: user.c_electronico
            },
            productos: productos,
            subtotal: subtotal.toFixed(2),
            iva: iva.toFixed(2),
            total: total.toFixed(2)
        };

        res.json({ success: true, invoice: invoice });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al generar la factura:', error);
        res.status(500).json({ success: false, message: error.message || "Error al generar la factura" });
    } finally {
        client.release();
    }
});



// Inicia el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
