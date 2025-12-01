const loadProductos = async () => {
    try {
        const response = await fetch("/api/productos");
        if (!response.ok) throw new Error("Error al obtener usuarios");

        const productos = await response.json();
        const productosTableBody = document.querySelector("#productos-table tbody");
        productosTableBody.innerHTML = "";

        productos.forEach((producto) => {
            const row = `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td data-categoria-id="${producto.categoria_id}">${producto.categoria_nombre}</td>
                    <td>
                        <img src="${producto.imagen_url}" alt="${producto.nombre}" style="width: 100px; height: auto; object-fit: cover;">
                    </td>
                </tr>`;
            productosTableBody.insertAdjacentHTML("beforeend", row);
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        alert("No se pudieron cargar los productos.");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".btn-danger");

    // Cargar los producto al cargar la página
    loadProductos();

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
