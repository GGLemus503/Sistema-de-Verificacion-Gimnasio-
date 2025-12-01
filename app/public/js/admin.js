// Contar todos los clientes
const loadTotalClientes = async () => {
    try {
      const response = await fetch("/api/total-clientes"); 
      if (!response.ok) throw new Error("Error al obtener total de clientes");
  
      const data = await response.json();
      const totalClientesElement = document.getElementById("total-clientes");
      totalClientesElement.textContent = data.cantidad_clientes;
    } catch (error) {
      console.error("Error al cargar total de clientes:", error);
    }
  };

//Contar Todos los Pagos del Dia
  const loadPagosDiaMes = async () => {
    try {
        const response = await fetch("/api/pagos-dia");
        if (!response.ok) throw new Error("Error al obtener pagos del mes");

        const data = await response.json();
        const pagosElement = document.getElementById("pagos-dia-mes");
        pagosElement.textContent = data.cantidad_pagos_dia;
    } catch (error) {
        console.error("Error al cargar pagos del mes:", error);
    }
};

//Contar Todos los Ingresos Mensuales
const loadIngresosMensuales = async () => {
    try {
      const response = await fetch("/api/ingresos-mensuales");
      if (!response.ok) throw new Error("Error al obtener ingresos mensuales");
  
      const data = await response.json();
  
      const total = parseFloat(data.total_ingresos_mes); // 👈 convertir a número
  
      const ingresosElement = document.getElementById("ingresos-mensuales");
      ingresosElement.textContent = isNaN(total)
        ? "$0.00"
        : `$${total.toFixed(2)}`;
    } catch (error) {
      console.error("Error al cargar ingresos mensuales:", error);
    }
  };

  
//Comparacion de Clientes Activos y Vencidos
const loadGraficoMembresias = async () => {
    try {
      const response = await fetch("/api/clientes-activos-vencidos");
      if (!response.ok) throw new Error("Error al obtener datos");
  
      const data = await response.json();
  
      const ctx = document.getElementById("membresiasChart").getContext("2d");
  
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Activos", "Vencidos"],
          datasets: [{
            data: [data.activos, data.vencidos],
            backgroundColor: ["#28a745", "#dc3545"],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            title: { display: false }
          }
        }
      });
    } catch (error) {
      console.error("Error al cargar gráfico de membresías:", error);
    }
  };
  
//Actualizar Membresias Vencidas
const actualizarMembresias = async () => {
  try {
    const response = await fetch("/api/actualizar-membresias");
    if (!response.ok) throw new Error("No se pudo actualizar membresías");
    await response.text(); // <-- Espera algo del servidor
    return true;
  } catch (error) {
    console.error("Error al actualizar membresías vencidas:", error);
    return false;
  }
};

    
  

document.addEventListener("DOMContentLoaded", async () => {
  const actualizado = await actualizarMembresias();  
  if (actualizado) {
    loadTotalClientes(); 
    loadPagosDiaMes();
    loadIngresosMensuales();
    loadGraficoMembresias();
  }

    const logoutButton = document.querySelector(".boton-danger");
    // Cerrar sesión
    logoutButton.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/logout", { method: "POST" });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = "/";
            } else {
                alert("Error al cerrar sesión");
            }
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    });
});



