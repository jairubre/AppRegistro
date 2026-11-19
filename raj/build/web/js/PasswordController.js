import { User } from "./User.js"; //Solo hay que LLAMARLO donde llegue un usuario en JSON:

class PasswordController {
 
    constructor() {
        // Elementos del formulario
        //getElementByID busca un elemento por su id y lo guarda para usarlos luego
        this.form = document.getElementById("changePasswordForm");
        this.actual = document.getElementById("currentPassword");
        this.nueva = document.getElementById("newPassword");
        this.repetida = document.getElementById("confirmPassword");
        this.mensaje = document.getElementById("responseMessage");
        // querySelector busca con un selector CSS, solo dentro del formulario: el botón de enviar
        this.boton = this.form.querySelector('button[type="submit"]');
        // se guarda el texto original para restaurarlo después
        this.textoBoton = this.boton.textContent;
 
        this.enviando = false;   // true mientras hay una petición en curso
        this.intentosFallidos = 0; // fallos seguidos con la contraseña actual
        this.bloqueadoHasta = 0;
 
        // role="alert": los lectores de pantalla leen en voz alta cada cambio de este elemento
        this.mensaje.setAttribute("role", "alert");
 
        // forEach recorre el array con los 3 campos
        [this.actual, this.nueva, this.repetida].forEach((campo) => {
            // si tiene texto, se llama a validar.
            // La flecha () => mantiene el "this" de la clase dentro del listener.
            campo.addEventListener("blur", () => campo.value.trim() && this.validar(campo));
        });
 
        // Botones "ojo": no tienen id, se buscan por clase y cada uno actúa sobre su input
        // querySelectorAll devuelve todos los elementos con esa clase (los 3 botones)
        this.form.querySelectorAll(".ver-password").forEach((boton) => {
            boton.addEventListener("click", () => this.alternarVisibilidad(boton));
        });
        // "submit" se dispara al pulsar el botón de enviar o al pulsar Enter dentro del formulario
        this.form.addEventListener("submit", (e) => this.enviarCambio(e));
    }
 
    // ---------- Interfaz ----------
    // Muestra un mensaje al usuario. Si no se indica color, sale en rojo (error).
    mostrarMensaje(texto, color = "#b3261e") {
        this.mensaje.textContent = texto; // textContent escribe texto plano
        this.mensaje.style.color = color;
        this.mensaje.style.textAlign = "center";
    }
 
    // Bloquea el botón mientras se procesa, para que no se pueda pulsar varias veces
    ocupado(estado) {
        this.enviando = estado; //true: peticion en curso
        this.boton.disabled = estado; // un botón disabled no se puede pulsar
        this.boton.textContent = estado ? "Actualizando..." : this.textoBoton;
    }
    
    // Muestra u oculta la contraseña del input al que pertenece el botón pulsado
    alternarVisibilidad(boton) {
        
        // closest() sube por el HTML hasta el contenedor ".campo-password";
        // desde ahí se busca SU input (así un solo método sirve para los 3 ojos)
        const input = boton.closest(".campo-password").querySelector("input");
        const mostrar = input.type === "password"; // true si ahora está oculta y hay que mostrarla
        input.type = mostrar ? "text" : "password"; // "text" la muestra, "password" la oculta con puntos
        boton.setAttribute("aria-pressed", String(mostrar));  // estado del botón para lectores de pantalla (siempre texto)
        boton.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña"); // lo que lee el lector
    }
 
    // ---------- Validación ----------
 
    // Devuelve el texto del error, o "" si el campo es correcto
    errorDe(campo) {
        const valor = campo.value.trim();// trim() quita los espacios del principio y del final
        
        // Contraseña actual: solo se exige que no esté vacía (la comprobación real se hace al enviar)
        if (campo === this.actual) {
            return valor ? "" : "Es obligatorio rellenar la contraseña actual";
        }
        // Contraseña nueva: obligatoria, con formato correcto y distinta de la actual
        if (campo === this.nueva) {
            if (!valor) return "Es obligatorio rellenar la nueva contraseña";
            // Expresión regular: ^ inicio (?=.*[A-Z]) hay una mayúscula (?=.*[0-9]) hay un número {8,} mínimo 8 caracteres $ fin
            if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(valor)) return "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
            if (valor === this.actual.value.trim()) return "La nueva contraseña debe ser distinta de la actual.";
            return "";
        }
         // Si llega aquí, el campo es "repetir contraseña": obligatorio e igual que la nueva
        if (!valor) return "Es obligatorio confirmar la nueva contraseña";
        return valor === this.nueva.value.trim() ? "" : "Las nuevas contraseñas no coinciden.";
    }
    // Valida un campo, muestra el resultado y devuelve true (válido) o false (inválido)
    
    validar(campo) {
        const error = this.errorDe(campo);
        this.mostrarMensaje(error); // si no hay error el texto es "" y se limpia el aviso anterior
        return !error; // "" (sin error) → true · texto (con error) → false
    }
 
    /**
     * @todo Comentar todas las sentencias
     * @todo Usar un objeto de la clase User para encapsularlos datos del usuario 
     *       al obtenerlos del sessionStorage.
     * @param {type} e
     * @returns {undefined}
     */
    
    // async permite usar await dentro (esperar la respuesta del servidor sin congelar la página)
    async enviarCambio(e) {
        e.preventDefault(); // evita que el formulario recargue la página
        if (this.enviando) return;   // ya hay un envío en curso: se ignoran las pulsaciones repetidas
        
         //si sigue activo el bloqueo (momento de desbloqueo - ahora) en ms, pasado a segundos
        const espera = Math.ceil((this.bloqueadoHasta - Date.now()) / 1000);
        if (espera > 0) {
            this.mostrarMensaje(`Demasiados intentos. Espera ${espera} segundos.`); //muestra mensaje
            return;
        }
 
         // Se valida campo por campo y se para en el primer error
        // every() se detiene en cuanto un campo devuelve false; el "!" delante significa "si alguno falla, salir"
        if (![this.actual, this.nueva, this.repetida].every((campo) => this.validar(campo))) return;
 
        // El login del equipo debe guardar: sessionStorage.setItem("userId", ...)
        // sessionStorage solo guarda texto; JSON.parse lo convierte de nuevo en objeto
       const datos = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
       const usuario = datos ? User.fromJSON(datos) : null;   // sesión
        
        if (!usuario) {
            window.location.href = "signIn.html"; //si no hay usuario te envia al login
            return;
        }
        
        //el id del usuario forma parte de la direccion a la que se envia el cambio
        
       
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            window.location.href = "signIn.html";
            return;
        }
        
        
        const url = `webresources/entities.user/${userId}`; // dirección del servicio REST de este usuario
        let exito = false;// se declara fuera del try para que el finally pueda leerla

        this.ocupado(true);// bloquea el botón antes de empezar
        try {
        
 
            //La contraseña actual debe coincidir con la guardada
             if (usuario.password !== this.actual.value.trim()) {
                 // ++ suma 1 antes de comparar
                if (++this.intentosFallidos >= 5) {   // 5 fallos seguidos con la contraseña actual
                    this.bloqueadoHasta = Date.now() + 30000;   // bloqueo de 30 segundos
                    this.intentosFallidos = 0;
                }
                this.actual.value = "";  // vacía el campo
                this.actual.focus(); // devuelve el cursor al campo para reintentar
                this.mostrarMensaje("La contraseña actual no es correcta.");
                return; // sale; el finally reactiva el botón
            }
 
            // 3. Se cambia SOLO la contraseña y se envía el usuario completo
             usuario.password = this.nueva.value.trim();
            
            // fetch hace la petición; await espera la respuesta del servidor
            const respuesta = await fetch(url, {
                method: "PUT",  // PUT = actualizar un recurso que ya existe
                headers: { "Content-Type": "application/json" }, // avisa de que el cuerpo es JSON
                body: JSON.stringify(usuario) // objeto = texto JSON
            });
           // fetch NO falla con 404 o 500, solo con errores de red: hay que comprobar respuesta.ok
           // (ok es true si el estado va de 200 a 299). Si no lo es, va a catch.
            if (!respuesta.ok) throw new Error("Estado " + respuesta.status);
           
            // 4. Se actualiza la sesión y se vuelve a la página principal
            sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
            sessionStorage.setItem("userPassword", usuario.password);
            this.intentosFallidos = 0; // se reinicia el contador
            exito = true;   // el botón queda bloqueado hasta salir de la página
            this.form.reset(); // vacía todos los campos
            this.mostrarMensaje("¡Contraseña actualizada con éxito!", "#2e7d32"); // verde, porque es correcto
            setTimeout(() => { window.location.href = "mainPage.html"; }, 1200);
            
        // catch: se ejecuta si algo del try lanza un error (red caída o el throw de arriba)
       } catch (error) {
       console.error("Error en la petición:", error); // detalle técnico, solo para el desarrollador
       this.mostrarMensaje("No se pudo guardar el cambio. Inténtalo de nuevo.");
  
        // finally: se ejecuta SIEMPRE (éxito, error o return dentro del try)
        } finally {
            if (!exito) this.ocupado(false); // si no hubo éxito, se reactiva el botón
        }
    }
}
 // DOMContentLoaded: se dispara cuando el HTML ya está cargado (antes los getElementById darían null).
// Aquí se crea el objeto y arranca todo.
document.addEventListener("DOMContentLoaded", () => new PasswordController());
