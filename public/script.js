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

});
