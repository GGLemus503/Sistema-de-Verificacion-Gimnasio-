// Cargar los clientes
const loadClientes = async () => {
    try {
        const response = await fetch("/api/clientes");
        if (!response.ok) throw new Error("Error al obtener clientes");

        const clientes = await response.json();
        const clientesTableBody = document.querySelector("#clientes-table tbody");
        clientesTableBody.innerHTML = "";

        clientes.forEach((cliente) => {
            const row = `
                <tr>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.pin}</td>
                    <td>${new Date(cliente.fecha_registro).toISOString().slice(0, 10)}</td>
                    <td>${new Date(cliente.fecha_inicio).toISOString().slice(0, 10)}</td>
                    <td>${new Date(cliente.fecha_fin).toISOString().slice(0, 10)}</td>
                    <td>${cliente.tipo_membresia}</td>
                    <td>$${cliente.precio}</td>
                    <td>${cliente.activa ? "Activa" : "Vencida"}</td>
                    <td><button class="btn btn-primary">Actualizar</button></td>
                </tr>`;
            clientesTableBody.insertAdjacentHTML("beforeend", row);
        });
    } catch (error) {
        console.error("Error al cargar los clientes:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".btn-danger");

    // Cargar clientes al cargar la página
    loadClientes();

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

    // Agregar cliente
    document.getElementById('agregar-cliente-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const pin = document.getElementById('pin').value;
        const tipo_membresia = document.getElementById('tipo_membresia').value;

        try {
            const response = await fetch('/api/clientes/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    pin,
                    tipo_membresia_id: tipo_membresia,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje);
                // Limpiar el formulario
                document.getElementById('agregar-cliente-form').reset();
                // Recargar la lista de clientes
                loadClientes();
            } else {
                alert(data.mensaje || 'Error al agregar cliente');
            }
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            alert('Ocurrió un error al agregar el cliente');
        }
    });
});
