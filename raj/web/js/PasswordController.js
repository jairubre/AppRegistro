
class PasswordController {
 
    constructor() {
        // Elementos del formulario
        this.form = document.getElementById("changePasswordForm");
        this.actual = document.getElementById("currentPassword");
        this.nueva = document.getElementById("newPassword");
        this.repetida = document.getElementById("confirmPassword");
        this.mensaje = document.getElementById("responseMessage");
        this.boton = this.form.querySelector('button[type="submit"]');
        this.textoBoton = this.boton.textContent;
 
        this.enviando = false;      // true mientras hay una petición en curso
        this.intentosFallidos = 0;
        this.bloqueadoHasta = 0;
 
        this.mensaje.setAttribute("role", "alert");
 
        // Al salir de un campo con contenido se valida (sin alert, sin bloquear la página)
        [this.actual, this.nueva, this.repetida].forEach((campo) => {
            campo.addEventListener("blur", () => campo.value.trim() && this.validar(campo));
        });
 
        // Botones "ojo": no tienen id, se buscan por clase y cada uno actúa sobre su input
        this.form.querySelectorAll(".ver-password").forEach((boton) => {
            boton.addEventListener("click", () => this.alternarVisibilidad(boton));
        });
 
        this.form.addEventListener("submit", (e) => this.enviarCambio(e));
    }
 
    // ---------- Interfaz ----------
 
    mostrarMensaje(texto, color = "#b3261e") {
        this.mensaje.textContent = texto;
        this.mensaje.style.color = color;
        this.mensaje.style.textAlign = "center";
    }
 
    // Bloquea el botón mientras se procesa, para que no se pueda pulsar varias veces
    ocupado(estado) {
        this.enviando = estado;
        this.boton.disabled = estado;
        this.boton.textContent = estado ? "Actualizando..." : this.textoBoton;
    }
 
    alternarVisibilidad(boton) {
        const input = boton.closest(".campo-password").querySelector("input");
        const mostrar = input.type === "password";
        input.type = mostrar ? "text" : "password";
        boton.setAttribute("aria-pressed", String(mostrar));
        boton.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
    }
 
    // ---------- Validación ----------
 
    // Devuelve el texto del error, o "" si el campo es correcto
    errorDe(campo) {
        const valor = campo.value.trim();
        if (campo === this.actual) {
            return valor ? "" : "Es obligatorio rellenar la contraseña actual";
        }
        if (campo === this.nueva) {
            if (!valor) return "Es obligatorio rellenar la nueva contraseña";
            if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(valor)) return "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
            if (valor === this.actual.value.trim()) return "La nueva contraseña debe ser distinta de la actual.";
            return "";
        }
        if (!valor) return "Es obligatorio confirmar la nueva contraseña";
        return valor === this.nueva.value.trim() ? "" : "Las nuevas contraseñas no coinciden.";
    }
 
    validar(campo) {
        const error = this.errorDe(campo);
        this.mostrarMensaje(error);
        return !error;
    }
 
   
    async enviarCambio(e) {
        e.preventDefault();
        if (this.enviando) return;   // ya hay un envío en curso: se ignoran las pulsaciones repetidas
 
        const espera = Math.ceil((this.bloqueadoHasta - Date.now()) / 1000);
        if (espera > 0) {
            this.mostrarMensaje(`Demasiados intentos. Espera ${espera} segundos.`);
            return;
        }
 
        // Se valida campo por campo y se para en el primer error
        if (![this.actual, this.nueva, this.repetida].every((campo) => this.validar(campo))) return;
 
        // El login del equipo debe guardar: sessionStorage.setItem("userId", ...)
        const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
        if (!usuario) {
            window.location.href = "signIn.html";
            return;
        }

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            window.location.href = "signIn.html";
            return;
        }
        const url = `webresources/entities.user/${userId}`;
        let exito = false;

        this.ocupado(true);
        try {
        
 
            // 2. La contraseña actual debe coincidir con la guardada
            if (usuario.password !== this.actual.value.trim()) {
                if (++this.intentosFallidos >= 5) {   // 5 fallos seguidos con la contraseña actual
                    this.bloqueadoHasta = Date.now() + 30000;   // bloqueo de 30 segundos
                    this.intentosFallidos = 0;
                }
                this.actual.value = "";
                this.actual.focus();
                this.mostrarMensaje("La contraseña actual no es correcta.");
                return;
            }
 
            // 3. Se cambia SOLO la contraseña y se envía el usuario completo
             usuario.password = this.nueva.value.trim();
            const respuesta = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });
           if (!respuesta.ok) throw new Error("Estado " + respuesta.status);
 
            // 4. Se actualiza la sesión y se vuelve a la página principal
            sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
            sessionStorage.setItem("userPassword", usuario.password);
            this.intentosFallidos = 0;
            exito = true;   // el botón queda bloqueado hasta salir de la página
            this.form.reset();
            this.mostrarMensaje("¡Contraseña actualizada con éxito!", "#2e7d32");
            setTimeout(() => { window.location.href = "mainPage.html"; }, 1200);
 
       } catch (error) {
       console.error("Error en la petición:", error);
       this.mostrarMensaje("No se pudo guardar el cambio. Inténtalo de nuevo.");
  
        } finally {
            if (!exito) this.ocupado(false);
        }
    }
}
 
document.addEventListener("DOMContentLoaded", () => new PasswordController());
