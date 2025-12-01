document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
        Swal.fire({
            title: "Error",
            text: "Por favor, completa todos los campos.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: "¡Bienvenido!",
                text: result.message,
                icon: "success",
                confirmButtonText: "Continuar",
            }).then(() => {
                window.location.href = result.redirectURL;
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.message || "Credenciales incorrectas.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al iniciar sesión. Inténtalo nuevamente.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    }
});
