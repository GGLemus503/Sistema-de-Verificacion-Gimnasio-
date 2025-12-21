document.addEventListener("DOMContentLoaded", () => {
  loadUsuarios();
});

async function loadUsuarios() {
  try {
    console.log("Cargando usuarios...");

    const resp = await fetch("/api/configuracion", {
      credentials: "same-origin"
    });

    if (!resp.ok) {
      console.error("Status:", resp.status);
      const text = await resp.text();
      console.error("Respuesta:", text);
      return;
    }

    const usuarios = await resp.json();
    console.log("Usuarios recibidos:", usuarios);

    const usuariosTableBody = document.querySelector("#usuarios-table tbody");

    if (!usuariosTableBody) {
      console.error("No existe #usuarios-table tbody");
      return;
    }

    usuariosTableBody.innerHTML = "";

    usuarios.forEach((usuario) => {
      const fecha = usuario.fecha_registro
        ? new Date(usuario.fecha_registro).toISOString().slice(0, 10)
        : "";

      const row = `
        <tr>
          <td>${usuario.nombre}</td>
          <td>${usuario.pin}</td>
          <td>${fecha}</td>
          <td>
            <button class="btn btn-primary btn-sm" data-id="${usuario.id}">
              Editar
            </button>
          </td>
        </tr>
      `;

      usuariosTableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error en loadUsuarios:", error);
  }
}
