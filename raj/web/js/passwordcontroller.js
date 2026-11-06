import { User } from './User.js';

class PasswordController {
    
    constructor() {
        // Inicializamos los elementos del formulario
        this.form = document.getElementById("changePasswordForm");
        this.inputActual = document.getElementById("currentPassword");
        this.inputNueva = document.getElementById("newPassword");
        this.inputRepetida = document.getElementById("confirmPassword");
        
        // Botones del "ojo" (si usas la misma estructura que en el login)
        this.ojoActual = document.getElementById("ojoActual");
        this.ojoNueva = document.getElementById("ojoNueva");
        this.ojoRepetida = document.getElementById("ojoRepetida");

        // Eventos de validación al salir de cada campo (blur)
        this.inputActual.addEventListener("blur", () => this.validarPasswordActual());
        this.inputNueva.addEventListener("blur", () => this.validarPasswordNueva());
        this.inputRepetida.addEventListener("blur", () => this.validarPasswordRepetida());
        
        // Evento submit para enviar el contenido
        this.form.addEventListener("submit", (e) => this.enviarCambio(e));
        
        // Eventos para ver/ocultar contraseña
        if (this.ojoActual) this.ojoActual.addEventListener("click", () => this.alternarPassword(this.ojoActual, this.inputActual));
        if (this.ojoNueva) this.ojoNueva.addEventListener("click", () => this.alternarPassword(this.ojoNueva, this.inputNueva));
        if (this.ojoRepetida) this.ojoRepetida.addEventListener("click", () => this.alternarPassword(this.ojoRepetida, this.inputRepetida));
    }
        
    // Función del botón "ojo"
    alternarPassword(btn, input) {
        if (input.type === "password") {
            input.type = "text";
            btn.setAttribute("aria-pressed", "true");
        } else {
            input.type = "password";
            btn.setAttribute("aria-pressed", "false");
        }
    }
      
    validarPasswordActual() {
        const passwordActual = this.inputActual.value.trim();
        if (passwordActual === "") { 
            alert("Es obligatorio rellenar la contraseña actual");
            return false;
        }
        return true;
    }

    validarPasswordNueva() {
        const passwordNueva = this.inputNueva.value.trim();
        const expRegular = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/; // Misma regla que en tu login
        
        if (passwordNueva === "") {
            alert("Es obligatorio rellenar la nueva contraseña");
            return false;
        }
        if (!expRegular.test(passwordNueva)) {
            alert("La nueva contraseña debe tener al menos 8 caracteres y contener una minúscula y un número.");
            return false;
        }
        return true;
    }

    validarPasswordRepetida() {
        const passwordNueva = this.inputNueva.value.trim();
        const passwordRepetida = this.inputRepetida.value.trim();
        
        if (passwordRepetida === "") {
            alert("Es obligatorio confirmar la nueva contraseña");
            return false;
        }
        if (passwordRepetida !== passwordNueva) {
            alert("Las nuevas contraseñas no coinciden.");
            return false;
        }
        return true;
    }

    // Método asíncrono principal (con PUT, ID y sessionStorage)
    async enviarCambio(e) {
        e.preventDefault();
        
        // Validamos todos los campos antes de enviar
        if (!this.validarPasswordActual() || !this.validarPasswordNueva() || !this.validarPasswordRepetida()) {
            console.log("Validación fallida. No se puede enviar el formulario.");
            return;
        }
        
        // Recuperamos el ID y los datos del usuario desde el sessionStorage
        //const userId = sessionStorage.getItem('userId');
        const userId= 299985563;
        
        if (!userId) {
            alert("No hay una sesión activa. Por favor, inicia sesión de nuevo.");
            window.location.href = "signIn.html";
            return;
        }

        const url = `http://localhost:8080/raj/webresources/entities.user/{id}`;
        
        const passwordActualIngresada = this.inputActual.value.trim();
        const passwordNuevaIngresada = this.inputNueva.value.trim();
        const passwordGuardadaActual = sessionStorage.getItem('userPassword');

        // Comprobación de seguridad con la contraseña actual en sesión
        if (passwordGuardadaActual && passwordActualIngresada !== passwordGuardadaActual) {
            alert("La contraseña actual no es correcta.");
            this.inputActual.value = "";
            this.inputActual.focus();
            return;
        }

        try {
            // Reconstruimos el objeto con los datos de sesión para hacer el PUT
            const usuarioActualizado = {
                id: userId,
                city: sessionStorage.getItem('userCity'),
                email: sessionStorage.getItem('userEmail'),
                firstName: sessionStorage.getItem('userFirstName'),
                lastName: sessionStorage.getItem('userLastName'),
                middleInitial: sessionStorage.getItem('userMiddleInitial'),
                password: passwordNuevaIngresada,
                phone: sessionStorage.getItem('userPhone'),
                state: sessionStorage.getItem('userState'),
                street: sessionStorage.getItem('userStreet'),
                zip: sessionStorage.getItem('userZip')
            };
               console.log(JSON.stringify(usuarioActualizado));
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(usuarioActualizado)
            });

            if (!response.ok) {
                throw new Error("Error al conectar con el servidor o actualizar la contraseña.");
            }

            // Actualizamos el sessionStorage
            sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado));
            sessionStorage.setItem('userPassword', passwordNuevaIngresada);

            alert("¡Contraseña actualizada con éxito!");
            console.log("Contraseña modificada correctamente para el usuario ID:", userId);
            
            this.form.reset();
            window.location.href = "mainPage.html";

        } catch (error) {
            console.error("Hubo un error en la petición fetch:", error);
            alert("No se pudo completar la solicitud de cambio de contraseña.");
        }
    }

// ============================================================
    // MÉTODOS DE UI (GESTIÓN DE LOS OJOS)
    // ============================================================

    inputDelOjo(boton) {
        return boton.closest(".campo-password").querySelector("input");
    }

    alternarVisibilidad(boton) {
        const input = this.inputDelOjo(boton);
        const mostrar = input.type === "password";

        input.type = mostrar ? "text" : "password";
        boton.setAttribute("aria-pressed", String(mostrar));
        boton.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
    }
}

// Inicializar el controlador al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    new PasswordController();
});
