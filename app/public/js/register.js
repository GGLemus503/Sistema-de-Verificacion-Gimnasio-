document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        Swal.fire({
            title: "Error",
            text: "Completa todos los campos.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    const data = { user: username, email: email, password: password };

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: "Registro Exitoso",
                text: result.message,
                icon: "success",
                confirmButtonText: "Aceptar",
            }).then(() => {
                window.location.href = "/";
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.error || result.message,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al registrar el usuario.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    }
});
