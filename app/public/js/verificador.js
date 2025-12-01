// Verificación de Membresía
document.getElementById("verificarForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const codigo = document.getElementById("codigoCliente").value;
    const resultadoDiv = document.getElementById("resultado");
  
    try {
      const response = await fetch("/api/verificar-membresia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo }),
      });
  
      const data = await response.json();
  
      resultadoDiv.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning");
  
      if (data.estado === "activa") {
        resultadoDiv.classList.add("alert-success");
        resultadoDiv.innerHTML = `
          <i class="bi bi-check-circle-fill"></i> ¡El Cliente <strong>${data.nombre}</strong> tiene membresía <strong>activa</strong> hasta el <strong>${new Date(data.fecha_fin).toISOString().slice(0, 10)}</strong>.
        `;
      } else if (data.estado === "vencida") {
        resultadoDiv.classList.add("alert-danger");
        resultadoDiv.innerHTML = `
          <i class="bi bi-x-circle-fill"></i> ¡El Cliente <strong>${data.nombre}</strong> tiene membresía <strong>vencida</strong> desde el <strong>${new Date(data.fecha_fin).toISOString().slice(0, 10)}</strong>.
        `;
      } else if (data.estado === "no_encontrado") {
        resultadoDiv.classList.add("alert-warning");
        resultadoDiv.innerHTML = `
          <i class="bi bi-exclamation-triangle-fill"></i> Cliente no encontrado. Verifica el código ingresado.
        `;
      }
    } catch (error) {
      console.error("Error al verificar:", error);
      resultadoDiv.classList.remove("d-none");
      resultadoDiv.classList.add("alert-danger");
      resultadoDiv.innerHTML = `<i class="bi bi-exclamation-octagon-fill"></i> Error del servidor.`;
    }
  });
  
  // Función para agregar el pago del día
 // Abrir el modal cuando se hace clic en el botón "Agregar Pago del Día"
document.getElementById("btnAgregarPagoDia").addEventListener("click", () => {
    // Abrir el modal
    const myModal = new bootstrap.Modal(document.getElementById("confirmacionModal"));
    myModal.show();
  });
  
  // Confirmar el pago del día
  document.getElementById("confirmarPagoDia").addEventListener("click", async () => {
    const mensaje = document.getElementById("confirmacionPagoDia");
    const myModal = bootstrap.Modal.getInstance(document.getElementById("confirmacionModal"));
  
    try {
      const res = await fetch("/api/pago-dia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await res.json();
  
      // Mostrar el mensaje de confirmación
      mensaje.classList.remove("d-none", "alert-danger", "alert-success");
  
      if (res.ok) {
        mensaje.classList.add("alert-success");
        mensaje.textContent = "✅ Pago del día registrado con éxito.";
      } else {
        mensaje.classList.add("alert-danger");
        mensaje.textContent = data.message || "❌ Error al registrar el pago.";
      }
    } catch (err) {
      mensaje.classList.remove("d-none", "alert-success");
      mensaje.classList.add("alert-danger");
      mensaje.textContent = "❌ Error al registrar el pago.";
      console.error(err);
    }
  
    // Cerrar el modal
    myModal.hide();
  });
  

  // Limpiar el formulario y los mensajes
  document.getElementById("limpiar").addEventListener("click", () => {
    // Limpiar el input
    document.getElementById("codigoCliente").value = "";
  
    // Limpiar el resultado
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.classList.add("d-none");
  
    // Limpiar el mensaje de confirmación del pago
    const mensaje = document.getElementById("confirmacionPagoDia");
    mensaje.classList.add("d-none");
    mensaje.classList.remove("alert-success", "alert-danger");
    mensaje.textContent = "";
  });
  