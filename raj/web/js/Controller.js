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
        this.form.addEventListener("submit", (e) => this.handlersesion(e));
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
        const validarContrasena = this.password.value.trim();
        
        // Expresión regular para validar el formato del email
        // exige que la contraseña tenga 8 catracteres y que contenga una minus
       const expRegular = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
        
        // 1. Comprobar si el campo está vacío
        if(validarContrasena ===""){
              alert("Es obligatorio rellenar el campo");
               return false;
        }
        
         // 2. Comprobar si el formato del email es incorrecto
    if (!expRegular.test(validarContrasena)) {
        // si sale este mensaje es que no cumple ni el requisito. 
        alert("correo o contraseña mal ");
        return false;
    }
        
        // 3. Si pasa ambas validaciones, todo está correcto
        return true;
        
        
    }
   //si usas fetch tienes que ser asincrono, fetch envia una peticion 
   
   async handlersesion(e){
       //para evitar el burbujeo de eventos
       e.preventDefault();
       
       // 2. Validamos ambos campos antes de enviar
        const esEmailValido = this.validarEmail();
        const esPasswordValido = this.validarpassword();
        const url = `/raj/webresources/entities.user`;
        
       // Si alguno no es válido, detenemos el proceso
        if (!esEmailValido || !esPasswordValido) {
            console.log("Validación fallida. No se puede enviar el formulario.");
            return;
        }
        
        // cuando llamas al fetch hay que meterle el await porque es es asincono el fetch y puede hacer lo que quiera el usuario. 
         //const response = await fetch 
       try {
            // 2. Realizamos la petición GET a la API
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Si el servidor responde con un error (ej: 404, 500)
            if (!response.ok) {
                throw new Error("Error al conectar con el servidor o la base de datos.");
            }

            // 3. Convertimos la respuesta en un array de usuarios de la BDD
            const listaUsuarios = await response.json();
            
            // Obtenemos lo que ha escrito el usuario en el formulario
            const emailIngresado = this.email.value.trim();
            const passwordIngresado = this.password.value.trim();

            // 4. Buscamos si existe un usuario que coincida con el email y la contraseña
            const usuarioEncontrado = listaUsuarios.find(user => 
                user.email === emailIngresado && user.password === passwordIngresado
            );

            // 5. Comprobamos el resultado de la búsqueda

           
            
            if (usuarioEncontrado) {
                   //hago la sesion estorage por el objeto 
                   sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
                   
                   // Gsesion estorage individual.
                sessionStorage.setItem('userCity', usuarioEncontrado.city);
                sessionStorage.setItem('userEmail', usuarioEncontrado.email);
                sessionStorage.setItem('userFirstName', usuarioEncontrado.firstName);
                sessionStorage.setItem('userId', usuarioEncontrado.id);
                sessionStorage.setItem('userLastName', usuarioEncontrado.lastName);
                sessionStorage.setItem('userMiddleInitial', usuarioEncontrado.middleInitial);
                sessionStorage.setItem('userPassword', usuarioEncontrado.password);
                sessionStorage.setItem('userPhone', usuarioEncontrado.phone);
                sessionStorage.setItem('userState', usuarioEncontrado.state);
                sessionStorage.setItem('userStreet', usuarioEncontrado.street);
                sessionStorage.setItem('userZip', usuarioEncontrado.zip);
                
                alert(`¡Inicio de sesión exitoso! Bienvenido, ${usuarioEncontrado.firstName || 'Usuario'}`);
                console.log("Usuario autenticado:", usuarioEncontrado);
                
                // Redirigir a la página principal
                window.location.href = "mainPage.html";
            } else {
                //este error me salta cuando meto los caracteres de la contraseña bien pero no coincide.
                alert("Correo o contraseña incorrectos.");
            }

        } catch (error) {
            console.error("Hubo un error en la petición fetch:", error);
            alert("No se pudo completar la solicitud de inicio de sesión.");
        }
    }
        

    
}
   

   
   
   
   //inicializar el constructor  para que entre en los metodos. 
   //document es una variable local implicita
  document.addEventListener('DOMContentLoaded', () => {
    new SignInController();
    });
    