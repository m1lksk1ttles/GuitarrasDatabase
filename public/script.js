window.onload = () => {
  fetch('/guitarras')
    .then(response => response.json())
    .then(data => {
      const tabla = document.createElement('table');
      if (data.length === 0) {
        tabla.innerHTML = '<tr><td>No hay guitarras aún.</td></tr>';
      } else {
        const header = document.createElement('tr');
        Object.keys(data[0]).forEach(key => {
          const th = document.createElement('th');
          th.textContent = key;
          header.appendChild(th);
        });
        tabla.appendChild(header);

        data.forEach(row => {
          const tr = document.createElement('tr');
          Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
          });
          tabla.appendChild(tr);
        });
      }
      document.getElementById('tabla').appendChild(tabla);
    });
};
