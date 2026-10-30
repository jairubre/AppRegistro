/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

import {User} from './User.js'

//Es una expresion regular que me comprueba que el campo solo contiene letras
//const letras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

class SignInController {
    constructor() {
        //console.log("2. Constructor ejecutado");
        
         //Inicializamos lo elementos del formulario en lo verde llamamos la etiqueta id
        this.form =  document.getElementById("formulario");
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
        this.email.addEventListener("blur" , () => this.validarEmail());
        
         //this.email.addEventListener("focus", () => this.validarFocus()); lo hacemos con el css la ganancia de foco 
        this.password.addEventListener("blur", () => this.validarpassword());
        // añado el evento submit 
        this.form.addEventListener("submit", () => this.handlersesion());
    };
        
        // validar funciones. 
        
      
        validarEmail() {
    // Nos guardamos el dato recogido en el campo email
    const valida = this.email.value.trim(); // .trim() quita espacios accidentales al inicio/final
    
    // Expresión regular para validar el formato del email
    const expRegular = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    
    // 1. Comprobar si el campo está vacío
    if (valida === "") { 
        alert("Este campo es obligatorio");
        return false;
    }
    
    // 2. Comprobar si el formato del email es incorrecto
    if (!expRegular.test(valida)) {
        alert("Introduce un correo electrónico válido (ejemplo: nombre@correo.com)");
        return false;
    }
    
    // 3. Si pasa ambas validaciones, todo está correcto
    return true;
}

    validarpassword(){
        //nos guardamos el dato recogido en el campo email. 
        const validarContrasena = this.password.value.tim();
        
        // Expresión regular para validar el formato del email
        const expRegular = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        
        // 1. Comprobar si el campo está vacío
        if(validarContrasena ===""){
              alert("Es obligatorio rellenar el campo");
               return false;
        }
        
         // 2. Comprobar si el formato del email es incorrecto
    if (!expRegular.test(validarContrasena)) {
        alert("El email está mal escrito");
        return false;
    }
        
        // 3. Si pasa ambas validaciones, todo está correcto
        return true;
        
        
    }
   
   handlersesion(){
       
   }
   }
   
   //inicializar el dom  para que entre en los metodos. 
  document.addEventListener('DOMContentLoaded', () => {
    new SignInController();
});
    