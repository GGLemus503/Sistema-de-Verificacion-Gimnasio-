//Cargar las categorias
const loadCategorias = async () => {
    try {
        const response = await fetch("/api/categorias");
        if (!response.ok) throw new Error("Error al obtener productos");

        const categorias = await response.json();
        const categoriasTableBody = document.querySelector("#categorias-table tbody");
        categoriasTableBody.innerHTML = "";

        categorias.forEach((categoria) => {
            const row = `
                <tr>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                    <td>
                        <button class="btn btn-info" data-id="${categoria.id}" onclick="handleEdit(event)">Editar</button>
                        <button class="btn btn-danger" data-id="${categoria.id}" onclick="handleDelete(event)">Eliminar</button>
                    </td>
                </tr>`;
            categoriasTableBody.insertAdjacentHTML("beforeend", row);
        });
    } catch (error) {
        console.error("Error al cargar las categorias:", error);
        alert("No se pudieron cargar los categorias.");
    }
};




document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".btn-danger");

    // Cargar usuarios al cargar la página
    loadCategorias();

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



// Botón para crear una nueva categoria
document.getElementById("saveProductoButton").addEventListener("click", async () => {
    const nombre = document.getElementById("addNombre").value;
    const descripcion = document.getElementById("addDescripcion").value;

    // Validar campos vacíos
    if (!nombre || !descripcion) {
        Swal.fire({
            title: "Error",
            text: "Por favor, completa todos los campos.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    try {
        // Enviar los datos al servidor
        const response = await fetch("/api/createCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion }),
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                title: "Éxito",
                text: result.message,
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            const addCategoriaModal = bootstrap.Modal.getInstance(document.getElementById("addCategoriaModal"));
            addCategoriaModal.hide(); // Cerrar el modal 
            loadCategorias(); // Recargar la lista de productos
        } else {
            Swal.fire({
                title: "Error",
                text: result.message,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    } catch (error) {
        console.error("Error al agregar la categoria:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al guardar la categoria.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    }
});



// Función para manejar la edición del usuario
let editingCategoriaId = null;

// Función para manejar la edición del producto
const handleEdit = (event) => {
    const categoriaId = event.target.dataset.id;
    editingCategoriaId = categoriaId;

    const row = event.target.closest("tr");
    const nombre = row.children[0].textContent.trim();
    const descripcion = row.children[1].textContent.trim();

    // Rellenar los campos del modal
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editDescripcion").value = descripcion;

    // Cargar las categorías y seleccionar la actual
    loadCategorias(categoriaId);

    // Mostrar el modal
    const editCategoriaModal = new bootstrap.Modal(document.getElementById("editCategoriaModal"));
    editCategoriaModal.show();
};



// Guardar cambios de la edicion en la categoría
document.getElementById("saveEditButton").addEventListener("click", async () => {
    const nombre = document.getElementById("editNombre").value;
    const descripcion = document.getElementById("editDescripcion").value;

    // Validar campos vacíos
    if (!nombre || !descripcion) {
        Swal.fire({
            title: "Error",
            text: "Por favor, completa todos los campos.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    try {
        const response = await fetch(`/api/categorias/${editingCategoriaId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion }),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: "Confirmación",
                text: "Categoría actualizada con éxito.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });

            loadCategorias(); // Recargar lista de categorías

            // Cerrar el modal correctamente
            const editCategoriaModalEl = document.getElementById("editCategoriaModal");
            const editCategoriaModal = bootstrap.Modal.getInstance(editCategoriaModalEl);
            
            if (editCategoriaModal) {
                editCategoriaModal.hide();
            } else {
                // Alternativa si el modal no se cierra correctamente
                editCategoriaModalEl.classList.remove("show");
                document.body.classList.remove("modal-open");
                document.querySelector(".modal-backdrop")?.remove();
            }
        } else {
            Swal.fire({
                title: "Error",
                text: result.message,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    } catch (error) {
        console.error("Error al editar la categoría:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al actualizar la categoría.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    }
});





// Modal para confirmar eliminación
const deleteModal = new bootstrap.Modal(document.getElementById("deleteCategoriaModalLabel"));
let categoriaToDelete = null;

// Función para manejar la eliminación de usuario
const handleDelete = (event) => {
    const categoriaId = event.target.dataset.id;
    categoriaToDelete = categoriaId;
    deleteModal.show();
};


// Confirmar eliminación
document.getElementById("confirmDeleteButton").addEventListener("click", async () => {
    try {
        const response = await fetch(`/api/categorias/${categoriaToDelete}`, {
            method: "DELETE",
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                title: "Confirmacion",
                text: "Categoria Eliminada con Exito",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            loadCategorias(); 
            deleteModal.hide();
        } else {
            alert("Error al eliminar la categoria");
        }
    } catch (error) {
        console.error("Error al eliminar la categoria:", error);
    }
});

// Cancelar eliminación
document.getElementById("cancelDeleteButton").addEventListener("click", () => {
    deleteModal.hide();
});
