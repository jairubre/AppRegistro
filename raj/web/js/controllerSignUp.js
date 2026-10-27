/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
import {User} from './User.js'

//Expresiones regulares

 //Es una expresion regular que me comprueba que el campo solo contiene letras
const letras=/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

class SignUp{
    constructor(){
        //Inicializamos lo elementos del formulario
     this.form=document.getElementById("formRegistro");
     this.name=document.getElementById("nombre");
     this.surname=document.getElementById("Apellido");
     this.middlename=document.getElementById("nombreCompuesto");
     this.direccion=document.getElementById("calle");
     this.city=document.getElementById("ciudad");
     this.locality=document.getElementById("localidad");
     this.zipCode=document.getElementById("codigoPostal");
     this.phone=document.getElementById("telefono");
     this.email=document.getElementById("email");
     this.passwoed=document.getElementById("password");
     
     //Inicializamos lo eventos 
     
     //Name perdida de foco
     this.name.addEventlistener("blur",()=>this.validadNombre);
     
        
        
    }
    
    validarNombre(){
       const valor = this.name.value.trim();
       if(valor === ""){
           
       }
       
    }

}

