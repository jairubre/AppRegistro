/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

import {User} from './User.js'

//Es una expresion regular que me comprueba que el campo solo contiene letras
const letras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

class signIn {
    constructor() {
        //console.log("2. Constructor ejecutado")
        
         //Inicializamos lo elementos del formulario en lo verde llamamos la etiqueta id
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        //this.ojo = document.getElementById("ojo");
        
        
           /*
         * Inicializamos lo eventos todos los eventos que puede 
         * tener toda nuestra página web
         */
        
        // blur es foco en el campo cuando escriba el correo 
        // () refleja los paramateros que paso a la funcion 
        //this.validarEmail() este es el metodo.
        this.email.addEventListener("blur", () => this.validarEmail());
        this.password.addEventListener("blur", () => this.validarpassword());
    };
        
        // validar funciones. 
        
        validarEmail() {
    // Nos guardamos el dato recogido en el campo email
    const validarEmail = this.email.value.trim(); // .trim() quita espacios accidentales al inicio/final
    
    // Expresión regular para validar el formato del email
    const expRegular = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    
    // 1. Comprobar si el campo está vacío
    if (validarEmail === "") {
        alert("Es obligatorio rellenar el campo");
        return false;
    }
    
    // 2. Comprobar si el formato del email es incorrecto
    if (!expRegular.test(validarEmail)) {
        alert("El email está mal escrito");
        return false;
    }
    
    // 3. Si pasa ambas validaciones, todo está correcto
    return true;
}
}    