require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a base de datos
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

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// =========================
// ==== ENDPOINTS API =====
// =========================

// ✅ GET guitarras (todas o por id)
app.get('/guitarras', (req, res) => {
  let sql = 'SELECT * FROM guitarras';
  const id = req.query.idGuitarras;

  if (id) {
    sql = 'SELECT * FROM guitarras WHERE idGuitarras = ?';
  }

  pool.query(sql, id ? [id] : [], (err, results) => {
    if (err) {
      console.error('Error al consultar:', err);
      return res.status(500).json({ mensaje: 'Error al obtener guitarras' });
    }
    res.json(results);
  });
});

// ✅ POST - insertar guitarra
app.post('/guitarras', (req, res) => {
  const { idGuitarras, Marca, Modelo, Configuracion, CantPots } = req.body;

  if (!idGuitarras || !Marca || !Modelo || !Configuracion || !CantPots) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const sql = `
    INSERT INTO guitarras (idGuitarras, Marca, Modelo, Configuracion, CantPots)
    VALUES (?, ?, ?, ?, ?)
  `;

  pool.query(sql, [idGuitarras, Marca, Modelo, Configuracion, CantPots], (err, results) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ mensaje: 'Error al insertar guitarra' });
    }

    res.json({ mensaje: 'Guitarra agregada exitosamente' });
  });
});

// ✅ PUT - actualizar guitarra
app.put('/guitarras', (req, res) => {
  const { idGuitarras, Marca, Modelo, Configuracion, CantPots } = req.body;

  if (!idGuitarras || !Marca || !Modelo || !Configuracion || !CantPots) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const sql = `
    UPDATE guitarras
    SET Marca = ?, Modelo = ?, Configuracion = ?, CantPots = ?
    WHERE idGuitarras = ?
  `;

  pool.query(sql, [Marca, Modelo, Configuracion, CantPots, idGuitarras], (err, results) => {
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

// ✅ DELETE - eliminar guitarra
app.delete('/guitarras', (req, res) => {
  const { idGuitarras } = req.query;

  if (!idGuitarras) {
    return res.status(400).json({ mensaje: 'Falta idGuitarras' });
  }

  const sql = 'DELETE FROM guitarras WHERE idGuitarras = ?';

  pool.query(sql, [idGuitarras], (err, results) => {
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


// =========================

app.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}`);
});