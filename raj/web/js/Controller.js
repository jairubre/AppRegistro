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
        this.ojo = document.getElementById("ojo");
        
        
        
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
        // añado el evento submit para enviar el contenido 
        this.form.addEventListener("submit", () => this.handlersesion());
        //hacemos el evento del ojo para ver 
        this.ojo.addEventListener("click", () => this.alternarPassword(this.ojo,this.password ));
        
    };
        
        // validar funciones. 
        //funciones para el boron 
        alternarPassword(btn, input) {
        // Alternar el tipo de input entre password y text
        if (input.type === "password") {
            input.type = "text";
            // Opcional: Si quieres cambiar el estado visual o aria-pressed
            btn.setAttribute("aria-pressed", "true");
        } else {
            input.type = "password";
            btn.setAttribute("aria-pressed", "false");
        }
    }
        
      
        validarEmail() {
    // Nos guardamos el dato recogido en el campo email
    const validaEmail = this.email.value.trim(); // .trim() quita espacios accidentales al inicio/final
    
    // Expresión regular para validar el formato del email
    const expRegular = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    
    // 1. Comprobar si el campo está vacío
    if (validaEmail === "") { 
        alert("Este campo es obligatorio");
        return false;
    }
    
    // 2. Comprobar si el formato del email es incorrecto con la expresion regular.
    if (!expRegular.test(validaEmail)) {
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
   //si usas fetch tienes que ser asincrono, fetch envia una peticion 
   
   async handlersesion(){
       //me tiene que validar las credenciales aqui. 
    
   }
   
   // cuando llamas al fetch hay que meterle el await porque es es asincono el fetch y puede hacer lo que quiera el usuario. 
   //const response = await fetch 
   
   
   }
   
   //inicializar el constructor  para que entre en los metodos. 
   //document es una variable local implicita
  document.addEventListener('DOMContentLoaded', () => {
    new SignInController();
});
    