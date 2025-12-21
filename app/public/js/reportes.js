document.addEventListener("DOMContentLoaded", () => {
  cargarIngresos();
});

async function cargarIngresos() {
  const tabla = document.querySelector("#tabla-ingresos tbody");
  const ctx = document.getElementById("graficaIngresos");

  try {
    const res = await fetch("/api/reportes/ingresos-mensuales");
    const datos = await res.json();

    tabla.innerHTML = "";

    const labels = [];
    const totals = [];

    datos.forEach(row => {
      tabla.innerHTML += `
        <tr>
          <td>${row.mes}</td>
          <td>$${row.ingresos_membresias}</td>
          <td>$${row.ingresos_pagos_dia}</td>
          <td><strong>$${row.total}</strong></td>
        </tr>
      `;

      labels.push(row.mes);
      totals.push(row.total);
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Ingresos Mensuales",
          data: totals
        }]
      }
    });

  } catch (error) {
    console.error("Error cargando reporte:", error);
  }
}
