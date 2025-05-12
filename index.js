const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 5000;

// Configura tu conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // O pon la contraseña correcta si tiene
  database: 'c22100440',
  port: 3306
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Ruta HTML que muestra datos de una tabla
app.get('/', (req, res) => {
  connection.query('SELECT * FROM guitarras', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error en la base de datos');
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