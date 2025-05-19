window.addEventListener('DOMContentLoaded', () => {
  fetch('/api/guitarras')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('caja3');
      if (!data.length) {
        container.innerHTML = '<p>No hay guitarras registradas todavía.</p>';
        return;
      }

      let html = '<h2>A unas las extraño más que otras</h2><table border="1"><tr>';

      // Encabezados
      Object.keys(data[0]).forEach(col => {
        html += `<th>${col}</th>`;
      });
      html += '</tr>';

      // Filas
      data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => {
          html += `<td>${val}</td>`;
        });
        html += '</tr>';
      });

      html += '</table>';
      container.innerHTML = html;
    })
    .catch(err => {
      console.error('Error cargando guitarras:', err);
      document.getElementById('caja3').innerHTML = '<p>Error cargando datos.</p>';
    });

    eliminarBtn.addEventListener('click', () => {
    const id = form.idGuitarra.value;
    if (!id || isNaN(id)) {
      alert('Ingresa un ID válido para eliminar.');
      return;
    }

    fetch(`/api/guitarras/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          alert('Guitarra eliminada correctamente');
        } else {
          alert(result.error || 'No se pudo eliminar');
        }
        form.reset();
        cargarGuitarras();
      })
      .catch(err => {
        console.error('Error al eliminar guitarra:', err);
        alert('Error al eliminar guitarra');
      });
  });
});
