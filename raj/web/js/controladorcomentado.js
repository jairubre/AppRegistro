// ############################################################
// ARCHIVO SOLO PARA LEER Y ESTUDIAR. NO SE EJECUTA.
//
// - NO lo enlaces en ningún HTML con <script src="...">.
// - La última línea (la que arranca el controlador) está desactivada
//   con "//" a propósito, así que aunque se cargara no haría nada.
// - El archivo que usa la página es js/passwordcontroller.js
//   (este es una copia con comentarios para entender cómo funciona).
// ############################################################
 
// ============================================================
// CONTROLADOR DEL CAMBIO DE CONTRASEÑA
//
// Idea general (lo que pasa cuando el usuario pulsa el botón):
//   1. Se comprueba que los tres campos están bien escritos.
//   2. Se pide al servidor (GET) el usuario completo.
//   3. Se comprueba que la contraseña actual coincide con la del servidor.
//   4. Se cambia SOLO la contraseña y se devuelve al servidor (PUT).
//   5. Se actualiza la sesión y se vuelve a la página principal.
// Por el camino, la interfaz se protege para que no se pueda
// pulsar el botón muchas veces ni dejar la página colgada.
// ============================================================
class PasswordController {
 
    // El constructor se ejecuta UNA vez, al crear el controlador con "new".
    // Aquí se buscan los elementos de la página y se "enchufan" los eventos.
    constructor() {
 
        // ---------- Elementos del formulario (se buscan por su id en el HTML) ----------
        this.form = document.getElementById("changePasswordForm");
        this.actual = document.getElementById("currentPassword");     // campo "contraseña actual"
        this.nueva = document.getElementById("newPassword");          // campo "nueva contraseña"
        this.repetida = document.getElementById("confirmPassword");   // campo "repetir nueva"
        this.mensaje = document.getElementById("responseMessage");    // div donde salen los avisos
 
        // El botón de enviar no tiene id, así que se busca dentro del formulario
        // por su tipo. Guardamos su texto original para poder restaurarlo luego.
        this.boton = this.form.querySelector('button[type="submit"]');
        this.textoBoton = this.boton.textContent;
 
        // ---------- Variables de estado (la "memoria" del controlador) ----------
        this.enviando = false;      // true mientras hay una petición en curso
        this.intentosFallidos = 0;  // cuántas veces seguidas se ha fallado la contraseña actual
        this.bloqueadoHasta = 0;    // hora (en milisegundos) hasta la que está bloqueado; 0 = no bloqueado
 
        // role="alert" hace que los lectores de pantalla lean el mensaje en voz alta
        // cuando cambia (accesibilidad).
        this.mensaje.setAttribute("role", "alert");
 
        // ---------- Evento "blur": cuando el usuario SALE de un campo ----------
        // Se recorren los tres campos con forEach para no repetir el mismo código tres veces.
        // "campo.value.trim() &&" significa: solo valida si el campo NO está vacío.
        // (Un campo vacío ya lo controla el atributo "required" al enviar.)
        // Antes se usaban alert() aquí, y causaba un bucle infinito de avisos.
        [this.actual, this.nueva, this.repetida].forEach((campo) => {
            campo.addEventListener("blur", () => campo.value.trim() && this.validar(campo));
        });
 
        // ---------- Botones "ojo" (mostrar/ocultar contraseña) ----------
        // querySelectorAll devuelve TODOS los botones con clase "ver-password".
        // A cada uno se le asigna un clic que llama a alternarVisibilidad pasándole
        // ese mismo botón, así cada ojo sabe cuál es su campo sin necesitar un id.
        this.form.querySelectorAll(".ver-password").forEach((boton) => {
            boton.addEventListener("click", () => this.alternarVisibilidad(boton));
        });
 
        // ---------- Evento "submit": cuando se envía el formulario ----------
        // Salta al pulsar el botón Y también al pulsar Enter dentro de un campo.
        this.form.addEventListener("submit", (e) => this.enviarCambio(e));
    }
 
    // ============================================================
    // INTERFAZ: todo lo que cambia lo que el usuario ve
    // ============================================================
 
    // Escribe un texto en el div de avisos. Por defecto sale en rojo (error);
    // si se le pasa otro color (por ejemplo verde) lo usa en su lugar.
    mostrarMensaje(texto, color = "#b3261e") {
        this.mensaje.textContent = texto;
        this.mensaje.style.color = color;
        this.mensaje.style.textAlign = "center";
    }
 
    // Bloquea o desbloquea el botón. "estado" es true (ocupado) o false (libre).
    // Con el botón desactivado no se puede pulsar varias veces seguidas.
    ocupado(estado) {
        this.enviando = estado;
        this.boton.disabled = estado;
        // Operador ternario: si estado es true pone "Actualizando...", si no el texto original
        this.boton.textContent = estado ? "Actualizando..." : this.textoBoton;
    }
 
    // Alterna entre ver la contraseña (type="text") y ocultarla (type="password").
    alternarVisibilidad(boton) {
        // closest(): sube desde el botón hasta la caja ".campo-password" que lo contiene.
        // Luego querySelector("input") busca el campo de texto dentro de esa misma caja.
        // Así cada ojo actúa solo sobre su campo.
        const input = boton.closest(".campo-password").querySelector("input");
        const mostrar = input.type === "password";   // true si ahora está oculta
        input.type = mostrar ? "text" : "password";
        // aria-pressed lo usa el CSS para cambiar el icono (ojo abierto / tachado)
        boton.setAttribute("aria-pressed", String(mostrar));
        // aria-label es el texto que leen los lectores de pantalla
        boton.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
    }
 
    // ============================================================
    // VALIDACIÓN: comprobar que lo escrito es correcto
    // ============================================================
 
    // Revisa UN campo y devuelve el texto del error, o "" (vacío) si está bien.
    // Como "" cuenta como falso en JavaScript, luego se puede usar como si/no.
    errorDe(campo) {
        const valor = campo.value.trim();   // trim() quita espacios al principio y al final
 
        // Contraseña actual: solo se exige que no esté vacía
        if (campo === this.actual) {
            return valor ? "" : "Es obligatorio rellenar la contraseña actual";
        }
 
        // Nueva contraseña: tres reglas, comprobadas en este orden
        if (campo === this.nueva) {
            if (!valor) return "Es obligatorio rellenar la nueva contraseña";
            // Expresión regular: (?=.*[A-Z]) exige una mayúscula, (?=.*[0-9]) un número
            // y .{8,} al menos 8 caracteres en total.
            if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(valor)) return "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
            if (valor === this.actual.value.trim()) return "La nueva contraseña debe ser distinta de la actual.";
            return "";
        }
 
        // Si no era ninguno de los anteriores, es el campo "repetir": debe estar relleno y coincidir
        if (!valor) return "Es obligatorio confirmar la nueva contraseña";
        return valor === this.nueva.value.trim() ? "" : "Las nuevas contraseñas no coinciden.";
    }
 
    // Valida un campo, muestra su error (o borra el mensaje si no hay) y
    // devuelve true si está bien o false si hay error.
    // "!error" es true cuando error es "" (sin error).
    validar(campo) {
        const error = this.errorDe(campo);
        this.mostrarMensaje(error);
        return !error;
    }
 
    // ============================================================
    // SERVIDOR: comunicación con el servicio REST
    // ============================================================
 
    // Hace una petición con fetch, pero con tiempo máximo de espera.
    // Devuelve la respuesta si todo va bien, o lanza un error si algo falla.
    // "async" permite usar "await" dentro: esperar el resultado sin congelar la página.
    async pedir(url, opciones = {}) {
        // AbortController es un "interruptor" para cancelar la petición si tarda demasiado
        const control = new AbortController();
        // Programa la cancelación para dentro de 8 segundos (8000 milisegundos)
        const temporizador = setTimeout(() => control.abort(), 8000);   // si el servidor tarda más de 8 s, se cancela
        try {
            const respuesta = await fetch(url, {
                ...opciones,               // "..." copia aquí las opciones recibidas (method, body...)
                signal: control.signal,    // enlaza la petición con el interruptor de cancelación
                // Cabeceras: siempre pide JSON; si llegan más cabeceras en "opciones" se añaden
                headers: { "Accept": "application/json", ...opciones.headers }
            });
            // respuesta.ok es true si el código HTTP es 200-299. Si no (404, 500...), lanzamos error
            if (!respuesta.ok) throw new Error("Estado " + respuesta.status);
            return respuesta;
        } finally {
            // "finally" se ejecuta SIEMPRE, haya ido bien o mal: aquí apaga el temporizador
            // para que no cancele una petición que ya terminó.
            clearTimeout(temporizador);
        }
    }
 
    // ============================================================
    // PROCESO PRINCIPAL: se ejecuta al enviar el formulario
    // ============================================================
    async enviarCambio(e) {
        // Evita que el navegador envíe el formulario a su manera y recargue la página
        e.preventDefault();
 
        // PROTECCIÓN 1: si ya hay un envío en marcha, se ignora esta pulsación
        if (this.enviando) return;   // ya hay un envío en curso: se ignoran las pulsaciones repetidas
 
        // PROTECCIÓN 2: ¿está bloqueado por demasiados intentos fallidos?
        // Calcula cuántos segundos faltan para el desbloqueo (redondeando hacia arriba).
        const espera = Math.ceil((this.bloqueadoHasta - Date.now()) / 1000);
        if (espera > 0) {
            this.mostrarMensaje(`Demasiados intentos. Espera ${espera} segundos.`);
            return;
        }
 
        // Validación de los tres campos. every() se detiene en el PRIMER campo que falla
        // (devuelve false), y ese campo ya habrá mostrado su mensaje de error.
        // Se valida campo por campo y se para en el primer error
        if (![this.actual, this.nueva, this.repetida].every((campo) => this.validar(campo))) return;
 
        // Se lee el id del usuario desde la sesión del navegador (sessionStorage).
        // Lo guarda el login de otro compañero: sessionStorage.setItem("userId", ...)
        // El login del equipo debe guardar: sessionStorage.setItem("userId", ...)
        const userId = sessionStorage.getItem("userId");
        // Si no hay id es que no se ha iniciado sesión: se manda a la página de login
        if (!userId) {
            window.location.href = "signIn.html";
            return;
        }
        // URL del usuario concreto. ${userId} se sustituye por su valor
        // (por eso la cadena va entre comillas invertidas ` `).
        const url = `http://localhost:8080/raj/webresources/entities.user/${userId}`;
        let exito = false;   // se pondrá en true solo si todo sale bien
 
        // A partir de aquí: botón bloqueado y mensaje "Actualizando..."
        this.ocupado(true);
        try {
            // PASO 1: pedir el usuario completo al servidor (GET).
            // Hay dos await porque primero se espera la respuesta (pedir)
            // y después se espera a convertir su cuerpo de texto a objeto (.json()).
            // 1. Usuario completo desde el servidor
            const usuario = await (await this.pedir(url)).json();
 
            // PASO 2: comparar la contraseña escrita con la que tiene el servidor
            // 2. La contraseña actual debe coincidir con la guardada
            if (usuario.password !== this.actual.value.trim()) {
                // ++ suma 1 al contador ANTES de comparar. Al llegar a 5 fallos, se bloquea:
                if (++this.intentosFallidos >= 5) {   // 5 fallos seguidos con la contraseña actual
                    // Date.now() es la hora actual en ms; sumando 30000 se obtiene "dentro de 30 s"
                    this.bloqueadoHasta = Date.now() + 30000;   // bloqueo de 30 segundos
                    this.intentosFallidos = 0;   // el contador empieza de nuevo tras el bloqueo
                }
                this.actual.value = "";   // vacía el campo equivocado
                this.actual.focus();      // y pone el cursor en él
                this.mostrarMensaje("La contraseña actual no es correcta.");
                return;   // sale; el "finally" de abajo vuelve a desbloquear el botón
            }
 
            // PASO 3: cambiar SOLO la contraseña y enviar el usuario completo (PUT).
            // El PUT reemplaza el registro entero, por eso se envían todos los datos del
            // usuario tal como vinieron del servidor (si no, el resto quedaría a null).
            // 3. Se cambia SOLO la contraseña y se envía el usuario completo
            usuario.password = this.nueva.value.trim();
            await this.pedir(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },   // avisa al servidor de que el cuerpo es JSON
                body: JSON.stringify(usuario)                       // convierte el objeto a texto JSON
            });
 
            // PASO 4: todo ha ido bien. Se actualiza la sesión y se avisa al usuario.
            // 4. Se actualiza la sesión y se vuelve a la página principal
            sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
            sessionStorage.setItem("userPassword", usuario.password);
            this.intentosFallidos = 0;   // contraseña correcta: se reinicia el contador de fallos
            exito = true;   // el botón queda bloqueado hasta salir de la página
            this.form.reset();   // vacía los tres campos
            this.mostrarMensaje("¡Contraseña actualizada con éxito!", "#2e7d32");   // verde
            // Espera 1,2 segundos para que se lea el mensaje y luego va a la página principal
            setTimeout(() => { window.location.href = "mainPage.html"; }, 1200);
 
        // Si algo falla dentro del "try" (servidor caído, error 404/500, tiempo agotado...)
        // el código salta directamente aquí.
        } catch (error) {
            console.error("Error en la petición:", error);   // detalle técnico, visible en F12 > Console
            // AbortError es el error que provoca nuestro propio temporizador de 8 segundos
            this.mostrarMensaje(error.name === "AbortError"
                ? "El servidor tarda demasiado en responder. Inténtalo de nuevo."
                : "No se pudo completar la solicitud de cambio de contraseña.");
 
        // "finally" se ejecuta SIEMPRE (éxito, error o return intermedio).
        } finally {
            // Si NO hubo éxito, se desbloquea el botón para poder reintentar.
            // Si hubo éxito se deja bloqueado hasta la redirección, para que no se pulse de nuevo.
            if (!exito) this.ocupado(false);
        }
    }
}
 
// Crea el controlador cuando el HTML ya está cargado (evento DOMContentLoaded).
// Sin esta línea, la clase existiría pero nunca se ejecutaría
// (por eso aquí está desactivada: este archivo es solo de lectura).
// document.addEventListener("DOMContentLoaded", () => new PasswordController());   // <- DESACTIVADA: en el archivo real esta línea no lleva "//"


