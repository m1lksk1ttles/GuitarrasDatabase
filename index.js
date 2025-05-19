require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public')); // Para servir archivos estáticos
app.use(bodyParser.urlencoded({ extended: false }));

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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/guitarras', (req, res) => {
  pool.query('SELECT * FROM guitarras', (err, results) => {
    if (err) {
      console.error('Error en DB:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.json(results);
  });
});

app.delete('/api/guitarras/:id', (req, res) => {
  const idGuitarra = req.params.id;
  
  if (!idGuitarra || isNaN(idGuitarra)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  pool.query('DELETE FROM guitarras WHERE idGuitarra = ?', [idGuitarra], (err, results) => {
    if (err) {
      console.error('Error al eliminar:', err);
      return res.status(500).json({ error: 'Error al eliminar guitarra' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Guitarra no encontrada' });
    }
    
    res.json({ success: true });
  });
});

app.post('/agregar', (req, res) => {
  const { idGuitarra, Marca, Modelo, Configuracion, CantPots } = req.body;
  pool.query('INSERT INTO guitarras (idGuitarra, Marca, Modelo, Configuracion, CantPots) VALUES (?, ?, ?, ?, ?)', 
    [idGuitarra, Marca, Modelo, Configuracion, CantPots], 
    (err, results) => {
      if (err) {
        console.error('Error al insertar:', err);
        return res.status(500).send('Error al insertar en la base de datos');
      }
      res.redirect('/');
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
