require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 5000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  pool.query('SELECT * FROM guitarras', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.send('Error en la base de datos');
    }

    if (results.length === 0) {
      return res.send('La tabla está vacía.');
    }

    let html = '<h1>Datos de la tabla</h1><table border="1"><tr>';
    Object.keys(results[0]).forEach(col => {
      html += `<th>${col}</th>`;
    });
    html += '</tr>';

    results.forEach(row => {
      html += '<tr>';
      Object.values(row).forEach(val => {
        html += `<td>${val}</td>`;
      });
      html += '</tr>';
    });

    html += '</table>';
    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});