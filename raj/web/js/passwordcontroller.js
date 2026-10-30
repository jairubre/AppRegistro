import { User } from './User.js';

// ============================================================
// CONFIGURACIÓN LOCAL (Fuera de la clase)
// ============================================================
const URL_PASSWORD = "webresources/password";
const PAGINA_PRINCIPAL = "mainPage.html";
const REGLA_PASSWORD = /^(?=.*[A-Z])(?=.*[0-9]).{8,128}$/;

// Colores de capa especificados en el diseño
const COLOR_ROJO = "#ff0000";
const COLOR_VERDE = "#00b894";

export class PasswordController {

    constructor() {
        /*
         * ATRIBUTOS CON LOS ELEMENTOS DE LA PÁGINA
         */
        this.form = document.getElementById("changePasswordForm");
        this.inputActual = document.getElementById("currentPassword");
        this.inputNueva = document.getElementById("newPassword");
        this.inputRepetida = document.getElementById("confirmPassword");
        this.contenedorMensaje = document.getElementById("responseMessage");
        this.botonEnviar = this.form.querySelector("button[type='submit']");
        
        // Colección de botones tipo "ojito" para alternar la visibilidad
        this.botonesOjo = document.querySelectorAll(".ver-password");
        
        // Configuración de accesibilidad
        this.contenedorMensaje.setAttribute("aria-live", "polite");

        /*
         * EVENTOS REGISTRADOS DIRECTAMENTE EN EL CONSTRUCTOR
         */
        /*Validación al salir de cada campo)*/
        this.inputActual.addEventListener("blur", () => this.validarActual());
        this.inputNueva.addEventListener("blur", () => this.validarNueva());
        this.inputRepetida.addEventListener("blur", () => this.validarRepetida());
        // Evento principal de envío
        this.form.addEventListener("submit", (evento) => this.enviar(evento));

        // Eventos de los botones de "ojito"
        this.botonesOjo.forEach((boton) => {
            boton.addEventListener("click", () => this.alternarVisibilidad(boton));
        });
        
    }

    // ============================================================
    // MÉTODOS DE EVENTO Y FLUJO
    // ============================================================

    /** Se ejecuta al enviar el formulario. */
    async enviar(evento) {
        evento.preventDefault();

        // 1. Validación completa previa
        const error = this.validar();
        if (error) {
            this.mostrarMensaje(error, COLOR_ROJO);
            return;
        }

        // 2. Durante la espera: indicador de carga y bloqueo del botón
        this.botonEnviar.disabled = true;
        this.mostrarMensaje("Actualizando contraseña…", COLOR_ROJO); // O un color neutro/rojo según prefieras

        try {
            const estado = await this.enviarCambio(this.inputActual.value, this.inputNueva.value);
            this.tratarRespuesta(estado);
        } catch (e) {
            // Sin conexión con el servidor
            this.mostrarMensaje("Error inesperado, inténtalo más tarde.", COLOR_ROJO);
        } finally {
            // Desbloquear botón al recibir respuesta (si no se redirige antes)
            this.botonEnviar.disabled = false;
        }
    }

    /** Valida los campos según los requisitos de diseño. */
    validar() {
        const actual = this.inputActual.value;
        const nueva = this.inputNueva.value;
        const repetida = this.inputRepetida.value;

        if (!actual || !nueva || !repetida) {
            return "Por favor, completa los tres campos.";
        }
        if (!REGLA_PASSWORD.test(nueva)) {
            return "La nueva contraseña debe tener entre 8 y 128 caracteres, al menos una letra mayúscula y un número.";
        }
        if (nueva === actual) {
            return "La nueva contraseña debe ser distinta de la actual.";
        }
        if (nueva !== repetida) {
            return "Las nuevas contraseñas no coinciden.";
        }
        return "";
    }

    /** Valida el campo de contraseña actual al salir de él. */
    validarActual() {
        if (this.inputActual.value.trim() !== "") {
            this.mostrarMensaje("", COLOR_ROJO); // Limpia si está escrito
        }
    }

    /** Valida la nueva contraseña al salir del campo. */
    validarNueva() {
        const nueva = this.inputNueva.value;
        const actual = this.inputActual.value;

        if (!nueva) return;

        if (!REGLA_PASSWORD.test(nueva)) {
            this.mostrarMensaje("La nueva contraseña debe tener entre 8 y 128 caracteres, al menos una letra mayúscula y un número.", COLOR_ROJO);
        } else if (nueva === actual && actual !== "") {
            this.mostrarMensaje("La nueva contraseña debe ser distinta de la actual.", COLOR_ROJO);
        } else {
            this.mostrarMensaje("", COLOR_ROJO);
        }
    }

    /** Valida que la confirmación coincida al salir del campo. */
    validarRepetida() {
        const nueva = this.inputNueva.value;
        const repetida = this.inputRepetida.value;

        if (!repetida) return;

        if (repetida !== nueva) {
            this.mostrarMensaje("Las nuevas contraseñas no coinciden.", COLOR_ROJO);
        } else {
            this.mostrarMensaje("", COLOR_ROJO);
        }
    }
    
    
    /** Realiza la petición PUT al servidor RESTful (sin enviar 'repetida'). */
    async enviarCambio(currentPassword, newPassword) {
        const respuesta = await fetch(URL_PASSWORD, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ currentPassword, newPassword })
        });
        return respuesta.status;
    }

    /** Actúa según el código HTTP devuelto por el servidor. */
    tratarRespuesta(estado) {
        switch (estado) {
            case 200:
            case 204: // Éxito (Confirmación del servidor)
                this.form.reset();
                this.ocultarTodasLasContrasenas();
                // Capa verde (#00b894) con botón 'x' para cerrar y redirigir al cerrar
                this.mostrarMensajeExitoConCierre("Contraseña actualizada correctamente.");
                break;

            case 500: // Fallo: contraseña actual incorrecta o error del servidor
                this.mostrarMensaje("No se ha podido cambiar la contraseña. Comprueba la contraseña actual o inténtalo más tarde.", COLOR_ROJO);
                this.inputActual.value = "";
                this.inputActual.focus();
                break;

            default:
                this.mostrarMensaje("Error inesperado, inténtalo más tarde.", COLOR_ROJO);
        }
    }

    // ============================================================
    // MÉTODOS DE INTERFAZ Y UI
    // ============================================================

    /** Muestra mensajes generales en una capa con color personalizado. */
    /** Muestra mensajes generales con texto rojo sobre el fondo transparente de la página. */
    mostrarMensaje(texto, colorTexto) {
        this.contenedorMensaje.replaceChildren();
        if (!texto) return;

        const aviso = document.createElement("div");
        // Quitamos cualquier fondo, añadimos padding, bordes redondeados y un borde sutil opcional
        aviso.className = "alert col-12 p-3 mb-3 rounded-3 fw-medium border border-danger-subtle";
        
        // El texto toma el color rojo indicado (o por defecto un rojo legible) y el fondo es transparente
        aviso.style.color = colorTexto === "#ff0000" ? "#dc3545" : colorTexto;
        aviso.style.backgroundColor = "transparent";
        aviso.style.fontSize = "0.95rem";
        aviso.style.lineHeight = "1.4";
        
        aviso.textContent = texto;
        this.contenedorMensaje.appendChild(aviso);
    }

    /** Muestra el mensaje de éxito verde (#00b894) con una 'x' para cerrarlo y redirigir. */
    mostrarMensajeExitoConCierre(texto) {
        this.contenedorMensaje.replaceChildren();

        const aviso = document.createElement("div");
        aviso.className = "alert col-12 text-white d-flex justify-content-between align-items-center";
        aviso.style.backgroundColor = COLOR_VERDE;

        const spanTexto = document.createElement("span");
        spanTexto.textContent = texto;

        const botonCerrar = document.createElement("button");
        botonCerrar.className = "btn-close btn-close-white";
        botonCerrar.setAttribute("aria-label", "Cerrar");
        
        // Al hacer clic en la 'x', lleva al usuario a la página principal
        botonCerrar.addEventListener("click", () => {
            window.location.href = PAGINA_PRINCIPAL;
        });

        aviso.appendChild(spanTexto);
        aviso.appendChild(botonCerrar);
        this.contenedorMensaje.appendChild(aviso);
    }

    /** Devuelve el input asociado a un botón de ojito. */
    inputDelOjo(boton) {
        return boton.closest(".campo-password").querySelector("input");
    }

    /** Alterna la visibilidad de la contraseña. */
    alternarVisibilidad(boton) {
        const input = this.inputDelOjo(boton);
        const mostrar = input.type === "password";

        input.type = mostrar ? "text" : "password";
        boton.setAttribute("aria-pressed", String(mostrar));
        boton.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
    }

    /** Oculta todas las contraseñas tras un cambio exitoso. */
    ocultarTodasLasContrasenas() {
        this.botonesOjo.forEach((boton) => {
            this.inputDelOjo(boton).type = "password";
            boton.setAttribute("aria-pressed", "false");
            boton.setAttribute("aria-label", "Mostrar contraseña");
        });
    }
}
