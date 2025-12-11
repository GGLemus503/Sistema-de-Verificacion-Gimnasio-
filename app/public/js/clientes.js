const API_BASE = ""; 

async function loadClientes() {
  try {
    const resp = await fetch(`${API_BASE}/api/clientes`, { credentials: "same-origin" });
    if (!resp.ok) {
      console.error("GET /api/clientes status:", resp.status, await resp.text());
      throw new Error("Error al obtener clientes");
    }
    const clientes = await resp.json();
    const clientesTableBody = document.querySelector("#clientes-table tbody");
    clientesTableBody.innerHTML = "";

    clientes.forEach((cliente) => {
      const row = `
        <tr>
          <td>${cliente.nombre}</td>
          <td>${cliente.pin}</td>
          <td>${cliente.fecha_registro ? new Date(cliente.fecha_registro).toISOString().slice(0,10) : ''}</td>
          <td>${cliente.fecha_inicio ? new Date(cliente.fecha_inicio).toISOString().slice(0,10) : ''}</td>
          <td>${cliente.fecha_fin ? new Date(cliente.fecha_fin).toISOString().slice(0,10) : ''}</td>
          <td>${cliente.tipo_membresia}</td>
          <td>$${cliente.precio ?? ''}</td>
          <td>${cliente.activa ? "Activa" : "Vencida"}</td>
          <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalActualizarMembresia" data-usuario-id="${cliente.id}">
            Actualizar
            </button>
          </td>
        </tr>`;
      clientesTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Error al cargar los clientes:", err);
  }
}


// Cuando se abre el modal de actualizar, leemos el data-usuario-id del botón
document.addEventListener("click", (e) => {
    if (e.target.closest("[data-usuario-id]")) {
        const id = e.target.closest("[data-usuario-id]").getAttribute("data-usuario-id");
        document.getElementById("actualizar_usuario_id").value = id;
        console.log("Actualizando ID:", id);
    }
});

// Submit de actualizar membresía
const formActualizar = document.getElementById("actualizar-membresia-form");
formActualizar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario_id = document.getElementById("actualizar_usuario_id").value;
    const nuevo_tipo = document.getElementById("actualizar_tipo_membresia").value;

    try {
        const response = await fetch(`/api/clientes/actualizar/${usuario_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tipo_membresia_id: nuevo_tipo }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Membresía actualizada correctamente");

            // cerrar modal
            const modalEl = document.getElementById("modalActualizarMembresia");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            loadClientes();
        } else {
            alert(data.mensaje || "Error al actualizar");
        }

    } catch (err) {
        console.error("Error al actualizar membresía:", err);
        alert("Ocurrió un error");
    }
});


document.addEventListener("DOMContentLoaded", () => {
  // Guardas referencias con comprobación
  const logoutButton = document.querySelector(".btn-danger");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        const r = await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
        if (r.ok) {
          const d = await r.json();
          alert(d.message || "Sesión cerrada");
          window.location.href = "/";
        } else {
          console.error("Logout failed", r.status, await r.text());
          alert("Error al cerrar sesión");
        }
      } catch (e) {
        console.error("Error al cerrar sesión:", e);
      }
    });
  }

  // Cargar clientes
  loadClientes();

  // Asegurarse de que el formulario exista antes de registrar el listener
  const formAgregar = document.getElementById("agregar-cliente-form");
  if (!formAgregar) {
    console.warn("No se encontró #agregar-cliente-form en el DOM");
    return;
  }

  formAgregar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const pin = document.getElementById("pin").value;
    const tipo_membresia = document.getElementById("tipo_membresia").value;

    console.log("Enviando nuevo cliente:", { nombre, pin, tipo_membresia });

    try {
      const response = await fetch("/api/clientes/agregar", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          pin,
          tipo_membresia_id: tipo_membresia
        })
      });


      let bodyText;
      try { bodyText = await response.text(); } catch (e) { bodyText = null; }
      let json = null;
      try { json = bodyText ? JSON.parse(bodyText) : null; } catch (e) { json = null; }

      if (response.ok) {
        alert((json && json.mensaje) ? json.mensaje : "Cliente agregado correctamente");
        formAgregar.reset();
        const modalEl = document.getElementById("modalAgregarCliente");
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modal.hide();
        }
        loadClientes();
      } else {
        console.error("Error en agregar cliente:", response.status, json ?? bodyText);
        alert((json && json.mensaje) ? json.mensaje : `Error al agregar cliente (status ${response.status})`);
      }
    } catch (error) {
      console.error("Error al agregar cliente (fetch):", error);
      alert("Ocurrió un error al agregar el cliente (ver consola)");
    }
  });
});
