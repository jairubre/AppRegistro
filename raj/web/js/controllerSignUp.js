/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
import {User} from './User.js'

//Expresiones regulares

//Es una expresion regular que me comprueba que el campo solo contiene letras
const letras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
class SignUp {
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
        this.passwordConfirm = document.getElementById("confirmarPassword");
        /*
         * Inicializamos lo eventos todos los eventos que puede 
         * tener toda nuestra página web
         */


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
        this.form.addEventListener("submit", (eventoRegistro) => this.registrar(eventoRegistro));
    }

    validarName() {
        const nameTest = this.name.value.trim();
        if (nameTest === "") {
            alert("Has dejado el campo vacio y es obligatorio");
            return false;
        }
        return true;
    }
    validarSurname() {
        const surnameTest = this.surname.value.trim();
        if (surnameTest === "") {
            alert("Has dejado el campo vacio y es obligatorio");
            return false;
        }

        return true;
    }
    validarMiddle() {
        return true;
    }
    validarDireccion() {
        const direccionTest = this.street.value.trim();
        if (direccionTest === "") {
            alert("Has dejado el campo vacio y es obligatorio");
            return false;
        }
        return true;
    }
    validarCity() {
        const cityTest = this.city.value.trim();
        if (cityTest === "") {
            alert("Has dejado el campo vacio y es obligatorio");
            return false;
        }
        return true;
    }
    validarLocality() {
        const localityTest = this.locality.value.trim();
        if (localityTest === "") {
            alert("Has dejado el campo vacio y es obligatorio");
            return false;
        }
        return true;
    }
    validarZipCode() {
        const zipcodeTest = this.zipCode.value.trim();
        const ExpZipCode = /^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;
        if (zipcodeTest !== "") {
            if (ExpZipCode.test(zipcodeTest)){
                return true;
            }else{
                alert("El formato del codigo postal no es el adecuado");
               return false;
            }
            
        }
        alert("Has dejado el campo vacio y es obligatorio");
        return false;
        
        
    }
    validarPhone() {
        const phoneTest = this.phone.value.trim();
        if (phoneTest === "") {
            alert("Has dejado el campo vacio y es obligatorio");
            return false;
        }
        return true;
    }

    /*Funcion para validar el formato del correo*/
    validarEmail() {
        //Guardamos el correo en una variable
        const emailtest = this.email.value;
        //Genramosuna expresion regular para comprobar el formato del correo 
        const expRegular = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        //Comprobamos que el campo no este vacio
        if (emailtest !== "") {
            //Coparamos el correo con la expresion
            if (!expRegular.test(emailtest)) {
                //Si el formato no es correcto cuando el cliente pulse otro elemento le sale el fallo 
                alert("El email esta mal escrito");
                return false;
            }
        }
        alert("Es obligatorio rellenar el campo");
        return true;
    }
    validarPassword() {
        const c1 = this.password.value.trim();
        const c2 = this.passwordConfirm.value.trim();
        if (c1 !== c2) {
            alert("Las contraseñas no son iguales");
            return false;
        }

        return true;
    }

    registrar(eventoRegistro) {
        if (this.validarName() && this.validarSurname() && this.validarCity() && this.validarDireccion() && this.validarEmail()
                && this.validarLocality() && this.validarMiddle() && this.validarPassword()
                && this.validarPhone() && this.validarZipCode()) {
            alert("Todos los datos han sido introducidos de manera correcta");
        } else {
            alert("Algunos de los datos introducidos no son correctos");
        }
    }

}

new SignUp();