document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formGuitarra');
  const tablaDiv = document.getElementById('tabla');
  const eliminarBtn = document.getElementById('eliminarBtn');
  const actualizarBtn = document.getElementById('actualizarBtn');

  cargarGuitarras();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    data.idGuitarra = parseInt(data.idGuitarra);
    data.CantPots = parseInt(data.CantPots);

    try {
      const res = await fetch('/guitarras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resultado = await res.json();
      alert(resultado.mensaje);
      cargarGuitarras();
      form.reset();
    } catch (error) {
      alert('Error al agregar guitarra');
    }
  });

  eliminarBtn.addEventListener('click', async () => {
    const id = document.querySelector('[name="idGuitarras"]').value;
    if (!id) return alert('Debes ingresar un ID');

    try {
      const res = await fetch(`/guitarras?idGuitarras=${id}`, { method: 'DELETE' });
      const resultado = await res.json();
      alert(resultado.mensaje);
      cargarGuitarras();
    } catch (error) {
      alert('Error al eliminar guitarra');
    }
  });

  actualizarBtn.addEventListener('click', async () => {
    const data = Object.fromEntries(new FormData(form).entries());
    data.idGuitarra = parseInt(data.idGuitarra);
    data.CantPots = parseInt(data.CantPots);

    try {
      const res = await fetch('/guitarras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resultado = await res.json();
      alert(resultado.mensaje);
      cargarGuitarras();
    } catch (error) {
      alert('Error al actualizar guitarra');
    }
  });

  async function cargarGuitarras() {
    try {
      const res = await fetch('/guitarras');
      const guitarras = await res.json();

      let html = '<table><tr><th>idGuitarra</th><th>Marca</th><th>Modelo</th><th>Configuración</th><th>Pots</th></tr>';
      guitarras.forEach(g => {
        html += `<tr>
          <td>${g.idGuitarra}</td>
          <td>${g.Marca}</td>
          <td>${g.Modelo}</td>
          <td>${g.Configuracion}</td>
          <td>${g.CantPots}</td>
        </tr>`;
      });
      html += '</table>';

      tablaDiv.innerHTML = html;
    } catch (error) {
      tablaDiv.innerHTML = 'Error cargando datos';
    }
  }
});
