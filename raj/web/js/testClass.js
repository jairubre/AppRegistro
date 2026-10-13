/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
import {User} from './User.js'

var user= new User();

var email=document.getElementById("email");
var password=document.getElementById("password");


//Validación de los usuarios al backend en formato JSON

user=User.fromJSON("{id:0, firsName:'Jaime'}");
//Creamos un array
var users= new Array();
//Introducimos al Array un objeto de clase user
users.push(user);






