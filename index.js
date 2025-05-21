require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get('/guitarras', (req, res) => {
  pool.query('SELECT * FROM guitarras', (err, results) => {
    if (err) {
      console.error('Error en DB:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.json(results);
  });
});

app.post('/guitarras', (req, res) => {
  const { idGuitarra, Marca, Modelo, Configuracion, CantPots } = req.body;
  const sql = "";
  if (!idGuitarra || !Marca || !Modelo || !Configuracion || !CantPots) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  else 
  {
    sql = `INSERT INTO guitarras (idGuitarra, Marca, Modelo, Configuracion, CantPots) VALUES (?, ?, ?, ?, ?)`;
  }

  pool.query(sql, [idGuitarra, Marca, Modelo, Configuracion, CantPots], (err) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ mensaje: 'Error al insertar guitarra' });
    }
    res.json({ mensaje: 'Guitarra agregada exitosamente' });
  });
});

app.put('/guitarras', (req, res) => {
  const { idGuitarra, Marca, Modelo, Configuracion, CantPots } = req.body;
  const sql = "";
  if (!idGuitarra || !Marca || !Modelo || !Configuracion || !CantPots) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }
  else {
    sql = `UPDATE guitarras SET Marca = ?, Modelo = ?, Configuracion = ?, CantPots = ? WHERE idGuitarra = ?`;
  }

  pool.query(sql, [Marca, Modelo, Configuracion, CantPots, idGuitarra], (err, results) => {
    if (err) {
      console.error('Error al actualizar:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar guitarra' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Guitarra no encontrada' });
    }

    res.json({ mensaje: 'Guitarra actualizada correctamente' });
  });
});

app.delete('/guitarras', (req, res) => {
  const { idGuitarra } = req.query;
  const sql = "";
  if (!idGuitarra) {
    return res.status(400).json({ mensaje: 'Falta idGuitarra' });
  }
  else
  {
    sql = 'DELETE FROM guitarras WHERE idGuitarra = ?';
  }

  pool.query(sql, [idGuitarra], (err, results) => {
    if (err) {
      console.error('Error al eliminar:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar guitarra' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Guitarra no encontrada' });
    }

    res.json({ mensaje: 'Guitarra eliminada correctamente' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}`);
});
