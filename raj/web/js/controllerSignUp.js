/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
import {User} from './User.js'

//Expresiones regulares

//Es una expresion regular que me comprueba que el campo solo contiene letras

        class SignUpController {

        /**
         * @todo Usar document.querySelectorAll y forEach() para alternar visibilidad de las contraseñas.
         * @returns {SignUpController}
         */
        constructor() {
        console.log("2. Constructor ejecutado");
                //Inicializamos lo elementos del formulario
                this.form = document.getElementById("formRegistro");
                this.name = document.getElementById("nombre");
                this.surname = document.getElementById("apellido");
                this.middlename = document.getElementById("nombreCompuesto");
                this.street = document.getElementById("calle");
                this.city = document.getElementById("ciudad");
                this.locality = document.getElementById("localidad");
                this.zipCode = document.getElementById("codigoPostal");
                this.phone = document.getElementById("telefono");
                this.email = document.getElementById("email");
                this.password = document.getElementById("password");
                //Elemento ojo 
                // this.eye1 = document.getElementById("ojo1");
                // 
                //Ponemos la función queryselector
                this.boton = this.form.querySelector('button[type="submit"]');
                //this.eye2 = document.getElementById("ojo2");
                this.passwordConfirm = document.getElementById("confirmarPassword");
                this.errorEnvio = document.getElementById("errorEnvio");
                /*
                 * Inicializamos lo eventos todos los eventos que puede 
                 * tener toda nuestra página web
                 */
                //Blur es evento foco
                this.name.addEventListener("blur", () => this.validarName());
                this.surname.addEventListener("blur", () => this.validarSurname());
                this.middlename.addEventListener("blur", () => this.validarMiddle());
                this.street.addEventListener("blur", () => this.validarDireccion());
                this.city.addEventListener("blur", () => this.validarCity());
                this.locality.addEventListener("blur", () => this.validarLocality());
                this.zipCode.addEventListener("blur", () => this.validarZipCode());
                this.phone.addEventListener("blur", () => this.validarPhone());
                this.email.addEventListener("blur", () => this.validarEmail());
                this.passwordConfirm.addEventListener("blur", () => this.validarPassword());
                //Evento del ojo para mostrar y ocultar la contraseña
                /* this.eye1.addEventListener("click", () => this.alternarPassword(this.eye1, this.password));
                 this.eye2.addEventListener("click", () => this.alternarPassword(this.eye2, this.passwordConfirm));*/
                this.form.querySelectorAll(".ver-password").forEach((boton) => {
                boton.addEventListener("click", () => this.alternarVisibilidad(boton));
        });
                //Evento registrar, comprobamos todos los datos y hacemos el registro
                this.form.addEventListener("submit", (e) => this.handleregistrar(e));
        }

        //Funcion del boton 
        /* alternarPassword(boton, campo) {
         if (campo.type === "password") {
         campo.type = "text";
         boton.setAttribute("aria-pressed", "true");
         } else {
         campo.type = "password";
         boton.setAttribute("aria-pressed", "false");
         }
         }*/
        //Funcion nueva del boton para ponerlo visible
        alternarVisibilidad(boton) {
        const input = boton.closest(".campo-password").querySelector("input");
                const mostrar = input.type === "password";
                input.type = mostrar ? "text" : "password";
                boton.setAttribute("aria-pressed", String(mostrar));
                boton.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
        }

        validarName() {
        const errorName = document.getElementById("errorNombre");
                const nameTest = this.name.value.trim();
                const ExpName = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
                if (nameTest !== "") {
        if (ExpName.test(nameTest)) {
        return true;
        } else {
        errorName.textContent = "Error en el formato del nombre";
                errorName.style.color = "red";
                errorName.hidden = false;
                return false;
        }

        }
        errorName.textContent = "No puedes dejar este campo vacio";
                errorName.style.color = "red";
                errorName.hidden = false;
                return false;
        }

        validarSurname() {
        const errorSurname = document.getElementById("errorApellido");
                const surnameTest = this.surname.value.trim();
                if (surnameTest === "") {
        errorSurname.textContent = "No puedes dejar este campo vacio";
                errorSurname.style.color = "red";
                errorSurname.hidden = false;
                return false;
        }

        return true;
        }
        validarMiddle() {
        return true;
        }
        validarDireccion() {
        const errorDirecc = document.getElementById("errorDireccion");
                const direccionTest = this.street.value.trim();
                if (direccionTest === "") {
        errorDirecc.textContent = "No puedes dejar este campo vacio";
                errorDirecc.style.color = "red";
                errorDirecc.hidden = false;
                return false;
        }
        return true;
        }
        validarCity() {
        const errorCity = document.getElementById("errorCiudad");
                const cityTest = this.city.value.trim();
                if (cityTest === "") {
        errorCity.textContent = "No puedes dejar este campo vacio";
                errorCity.style.color = "red";
                errorCity.hidden = false;
                return false;
        }
        return true;
        }
        validarLocality() {
        const errorLocality = document.getElementById("errorLocalidad");
                const localityTest = this.locality.value.trim();
                if (localityTest === "") {
        errorLocality.textContent = "No puedes dejar este campo vacio";
                errorLocality.style.color = "red";
                errorLocality.hidden = false;
                return false;
        }
        return true;
        }
        validarZipCode() {
        const errorCode = document.getElementById("errorPostal");
                const zipcodeTest = this.zipCode.value.trim();
                const ExpZipCode = /^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;
                if (zipcodeTest !== "") {
        if (ExpZipCode.test(zipcodeTest)) {
        return true;
        } else {
        errorCode.textContent = "Este formato es erroneo";
                errorCode.style.color = "red";
                errorCode.hidden = false;
                return false;
        }

        }
        errorCode.textContent = "No puedes dejar este campo vacio";
                errorCode.style.color = "red";
                errorCode.hidden = false;
                return false;
        }
        validarPhone() {
        const errorPhone = document.getElementById("errorTelefono");
                const phoneTest = this.phone.value.trim();
                if (phoneTest === "") {
        errorPhone.textContent = "No puedes dejar este campo vacio";
                errorPhone.style.color = "red";
                errorPhone.hidden = false;
                return false;
        }
        return true;
        }

        /*Funcion para validar el formato del correo*/
        validarEmail() {
        const errorEmail = document.getElementById("errorEmail");
                //Guardamos el correo en una variable
                const emailtest = this.email.value;
                //Genramosuna expresion regular para comprobar el formato del correo 
                const expRegular = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
                //Comprobamos que el campo no este vacio
                if (emailtest !== "") {
        //Coparamos el correo con la expresion
        if (!expRegular.test(emailtest)) {
        //Si el formato no es correcto cuando el cliente pulse otro elemento le sale el fallo 
        errorEmail.textContent = "El formato de correo no es el corecto ej:nombre@gmail.com";
                errorEmail.style.color = "red";
                errorEmail.hidden = false;
                return false;
        }
        }

        return true;
        }
        validarPassword() {
        console.log("Has entrado en validar contraseña");
                const errorPass = document.getElementById("errorPassword");
                const c1 = this.password.value.trim();
                const c2 = this.passwordConfirm.value.trim();
                const passExp = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
                if (c1 !== "") {
        if (passExp.test(c1) && passExp.test(c2)) {
        if (c1 !== c2) {
        errorPass.textContent = "Las contraseñas no son iguales";
                errorPass.style.color = "red";
                errorPass.hidden = false;
                return false;
        } else {
        return true;
        }
        }
        }
        errorPass.textContent = "No puedes dejar el primer campo vacio";
                errorPass.style.color = "red";
                errorPass.hidden = false;
                return false;
        }
        /**
         * @todo Comentar todas las sentencias de este method.
         * @todo Cambiar la muestra de errores de alert() por el uso de un elemento de la página y su propiedad .textContent.
         * @todo Después de un signup exitoso guardar en el sessionStorage el email para que lo cargue la página de sigIn.
         * @todo Usar clase User para encapsular los datos del nuevo usuario antes de registrarlo en lugar de la variable usuario.
         * @param {type} 
         * @returns {undefined}
         */
        async handleregistrar(e) {
        e.preventDefault();
                const url = "/raj/webresources/entities.user";
                /*
                 * Llamamos a los métodos de validación antes de enviar, porque el usuario
                 * puede pulsar Registro sin pasar por todos los campos
                 */

                try {
                if (this.validarName() && this.validarSurname() && this.validarCity() && this.validarDireccion() && this.validarEmail()
                        && this.validarLocality() && this.validarMiddle() && this.validarPassword()
                        && this.validarPhone() && this.validarZipCode()) {

                  //Nos creamos una clase de user para guardar todos los campos de mi formulario
                const user = new User(
                        null,
                        this.name.value.trim(),
                        this.surname.value.trim(),
                        this.middlename.value.trim(),
                        this.street.value.trim(),
                        this.city.value.trim(),
                        this.locality.value.trim(),
                        Number(this.zipCode.value.trim()),
                        Number(this.phone.value.trim()),
                        this.email.value.trim(),
                        this.password.value.trim()
                        );
                        console.log(JSON.stringify(user));
                        //console.log(JSON.stringify(usuario));
                        //Creamos la respuesta para para enviarla al servidor en modo json
                        const respuesta = await fetch(url, {
                        method: "POST",
                                headers: {
                                "Content-Type": "application/json"
                                },
                                body: JSON.stringify(user)
                        });
                        //Comprobamos la respuesta que nos da el servidor 

                        if (respuesta.status === 200 || respuesta.status === 204) {
                            //Si no devuelve estado 200 0 204 mostramos mensaje error y guardamos en la sesión el correo para poder recogerlo en el SignIn
                this.errorEnvio.textContent = "El correo ha sido registrado";
                        this.errorEnvio.style.color = "green";
                        this.errorEnvio.hidden = false;
                        //Creo la sesión
                        sessionStorage.setItem('usuarioLogueado', JSON.stringify(user));
                        // Sesion storage individual.
                        sessionStorage.setItem('userEmail', user.email);
                        window.location.href = "signIn.html";
                        
                        
                } else if (respuesta.status === 500) {
                //alert("No se ha podido crear el usuario. Puede que el correo ya esté registrado");
                //si nos devuelve erros 500 le decimos q no se ha podio registrar el usuario 
                this.errorEnvio.textContent = "No se ha podido crear el usuario. Puede que el correo ya esté registrado";
                        this.errorEnvio.style.color = "red";
                        this.errorEnvio.hidden = false;
                } else {
                //alert("Error inesperado, inténtalo más tarde");
                this.errorEnvio.textContent = "Error inesperado, inténtalo más tarde";
                        this.errorEnvio.style.color = "red";
                        this.errorEnvio.hidden = false;
                }

                } else {
                //alert("Algunos de los datos introducidos no son correctos");
                this.errorEnvio.textContent = "Algunos de los datos introducidos no son correctos";
                        this.errorEnvio.style.color = "red";
                        this.errorEnvio.hidden = false;
                }
                } catch (error) {
        console.error("Algo ha fallado:", error);
                //alert("Error inesperado, inténtalo más tarde");
                this.errorEnvio.textContent = "Algunos de los datos introducidos no son correctos";
                this.errorEnvio.style.color = "red";
                this.errorEnvio.hidden = false;
        }
        }
        }
// Con este evento hacemos que carge la clase y con eso el constructor

document.addEventListener('DOMContentLoaded', () => {
new SignUpController();
});

