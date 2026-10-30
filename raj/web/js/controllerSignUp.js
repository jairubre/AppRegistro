/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
import {User} from './User.js'

//Expresiones regulares

//Es una expresion regular que me comprueba que el campo solo contiene letras

        class SignUpController {
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
        this.eye1=document.getElementById("ojo1");
        this.eye2=document.getElementById("ojo2");

        this.passwordConfirm = document.getElementById("confirmarPassword");
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
        this.eye1.addEventListener("click",()=>this.alternarPassword(this.eye1,this.password ));
        this.eye2.addEventListener("click",()=>this.alternarPassword(this.eye2,this.passwordConfirm));
        //Evento registrar, comprobamos todos los datos y hacemos el registro
        this.form.addEventListener("submit", () => this.handleregistrar());
    }
    
    //Funcion del boton 
    alternarPassword(boton, campo) {
    if (campo.type === "password") {
        campo.type = "text";
        boton.setAttribute("aria-pressed", "true");
    } else {
        campo.type = "password";
        boton.setAttribute("aria-pressed", "false");
    }
}

    validarName() {
        const nameTest = this.name.value.trim();
        const ExpName = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
        if (nameTest !== "") {
            if (ExpName.test(nameTest)) {
                return true;
            } else {
                alert("Introduce solo letras");
                return false;
            }

        }
        alert("No puedes dejar este campo vacio es obligatorio");
        return false;
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
            if (ExpZipCode.test(zipcodeTest)) {
                return true;
            } else {
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

    handleregistrar() {
        if (this.validarName() && this.validarSurname() && this.validarCity() && this.validarDireccion() && this.validarEmail()
                && this.validarLocality() && this.validarMiddle() && this.validarPassword()
                && this.validarPhone() && this.validarZipCode()) {
            alert("Todos los datos han sido introducidos de manera correcta");
        } else {
            alert("Algunos de los datos introducidos no son correctos");
        }
    }

}
// Con este even to hacemos que carge la clase y con eso el constructor

document.addEventListener('DOMContentLoaded',()=>{
    new SignUpController();
});

