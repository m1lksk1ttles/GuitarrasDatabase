document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formGuitarra');
  const eliminarBtn = document.getElementById('eliminarBtn');
  const actualizarBtn = document.getElementById('actualizarBtn');
  const tablaDiv = document.getElementById('tabla');

  async function cargarGuitarras() {
    try {
      const res = await fetch('/guitarras');
      const guitarras = await res.json();

      let tablaHTML = `
        <table>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Configuración</th>
            <th>Potenciómetros</th>
          </tr>
      `;

      guitarras.forEach(g => {
        tablaHTML += `
          <tr>
            <td>${g.idGuitarra}</td>
            <td>${g.Marca}</td>
            <td>${g.Modelo}</td>
            <td>${g.Configuracion}</td>
            <td>${g.CantPots}</td>
          </tr>`;
      });

      tablaHTML += '</table>';
      tablaDiv.innerHTML = tablaHTML;
    } catch (error) {
      console.error('Error al cargar guitarras:', error);
    }
  }

  function limpiarFormulario() {
    form.reset();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.CantPots = Number(data.CantPots);
    data.idGuitarra = Number(data.idGuitarra);

    try {
      const res = await fetch('/guitarras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.mensaje);
      limpiarFormulario();
      cargarGuitarras();
    } catch (error) {
      console.error('Error al agregar guitarra:', error);
    }
  });

  eliminarBtn.addEventListener('click', async () => {
    const idGuitarra = form.idGuitarra.value;
    if (!idGuitarra) return alert('Introduce un ID para eliminar');

    try 
    {
      const res = await fetch(`/guitarras?idGuitarra=${idGuitarra}`, 
      {
        method: 'DELETE'
      });

      const result = await res.json();
      alert(result.mensaje);
      limpiarFormulario();
      cargarGuitarras();
    } catch (error) {
      console.error('Error al eliminar guitarra:', error);
    }
  });

  actualizarBtn.addEventListener('click', async () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.CantPots = Number(data.CantPots);
    data.idGuitarra = Number(data.idGuitarra);

    try {
      const res = await fetch('/guitarras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.mensaje);
      limpiarFormulario();
      cargarGuitarras();
    } catch (error) {
      console.error('Error al actualizar guitarra:', error);
    }
  });

  cargarGuitarras();
});
