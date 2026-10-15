/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package service;

import entities.User;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.regex.Pattern;
 
/**
 * Recurso REST para cambiar la contraseña del usuario logueado.
 *
 * URL:    PUT /raj/webresources/password
 *         (/raj = nombre de la app, /webresources = @ApplicationPath de
 *          ApplicationConfig, /password = el @Path de esta clase)
 *
 * Body JSON: { "currentPassword": "...", "newPassword": "..." }
 *
 * Respuestas:
 *   204 No Content   -> contraseña cambiada correctamente
 *   400 Bad Request  -> datos inválidos (vacíos, no cumplen las reglas,
 *                       o la nueva es igual a la actual)
 *   401 Unauthorized -> no hay sesión iniciada
 *   403 Forbidden    -> la contraseña actual no es correcta
 *
 * REQUISITO con el compañero de SIGN IN: al hacer login correcto debe
 * guardar el EMAIL del usuario en la sesión, con este nombre exacto:
 *   request.getSession(true).setAttribute("email", usuario.getEmail());
 */
// @Stateless: es un EJB sin estado. El contenedor (GlassFish) abre una
// transacción automáticamente al entrar en cada método público y la cierra
// (commit) al salir. Gracias a eso no hace falta llamar a em.merge() ni
// a em.flush() para guardar los cambios.
@Stateless
// @Path: la parte de la URL que identifica a este recurso.
@Path("password")
// @Consumes: este recurso solo acepta peticiones con cuerpo en JSON.
@Consumes(MediaType.APPLICATION_JSON)
public class ChangePasswordResource {
 
    /**
     * Nombre del atributo de sesión donde el login guarda el email.
     * Se pone en una constante para que, si el equipo lo cambia, solo
     * haya que tocar esta línea.
     */
    private static final String ATRIBUTO_SESION_EMAIL = "email";
 
    /**
     * Regla de contraseña: la MISMA que en signUp.html
     * (mínimo 8 caracteres, al menos una mayúscula y al menos un número).
     * Se pone también un máximo de 128 para evitar abusos (el hash es
     * costoso de calcular y no queremos que nos manden textos enormes).
     * Se compila una sola vez (static final) por eficiencia.
     */
    private static final Pattern REGLA_PASSWORD
            = Pattern.compile("^(?=.*[A-Z])(?=.*[0-9]).{8,128}$");
 
    // @PersistenceContext: el contenedor nos inyecta el EntityManager,
    // que es quien habla con la base de datos.
    // IMPORTANTE: el nombre debe ser igual al de persistence.xml ("rajPU").
    @PersistenceContext(unitName = "rajPU")
    private EntityManager em;
 
    // @Context: el contenedor nos inyecta la petición HTTP actual.
    // La necesitamos para leer la sesión (HttpSession) del usuario.
    @Context
    private HttpServletRequest request;
 
    /**
     * Clase interna para el cuerpo del JSON. Los nombres de los campos
     * deben coincidir con las claves que manda el JS
     * (currentPassword y newPassword). JAX-RS convierte el JSON a este
     * objeto automáticamente.
     */
    public static class ChangePasswordRequest {
 
        public String currentPassword;
        public String newPassword;
    }
 
    // @PUT: este método responde a peticiones HTTP PUT (actualizar).
    @PUT
    public Response changePassword(ChangePasswordRequest req) {
 
        // 1. ¿HAY SESIÓN VÁLIDA?
        // getSession(false) devuelve la sesión si existe, o null si no
        // (con true crearía una nueva, y aquí no queremos eso).
        // El email del usuario sale SIEMPRE de la sesión, nunca del cliente,
        // para que nadie pueda cambiar la contraseña de otra persona.
        HttpSession session = request.getSession(false);
        Object emailSesion = (session == null)
                ? null
                : session.getAttribute(ATRIBUTO_SESION_EMAIL);
        if (!(emailSesion instanceof String) || ((String) emailSesion).isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED).build(); // 401
        }
        String email = (String) emailSesion;
 
        // 2. VALIDAR LOS DATOS RECIBIDOS
        // Se hace en el servidor aunque el navegador ya valide, porque
        // la validación del navegador se puede saltar fácilmente.
        if (req == null
                || isBlank(req.currentPassword)
                || isBlank(req.newPassword)
                || !REGLA_PASSWORD.matcher(req.newPassword).matches()
                || req.newPassword.equals(req.currentPassword)) {
            return Response.status(Response.Status.BAD_REQUEST).build(); // 400
        }
 
        // 3. BUSCAR AL USUARIO POR EMAIL
        // Usamos la consulta con nombre "User.findByEmail", que ya está
        // definida en la entidad User (@NamedQuery). Devuelve una lista
        // porque la entidad no marca el email como único; si el equipo
        // garantiza emails únicos, la lista tendrá 0 o 1 elementos.
        List<User> usuarios = em.createNamedQuery("User.findByEmail", User.class)
                .setParameter("email", email)
                .getResultList();
        User user = usuarios.isEmpty() ? null : usuarios.get(0);
 
        // 4. COMPROBAR LA CONTRASEÑA ACTUAL
        // Si el usuario no existe o la contraseña actual no coincide con
        // el hash guardado, devolvemos 403. Se usa el mismo código en
        // ambos casos para no dar pistas a un posible atacante.
        if (user == null || !Password.verify(req.currentPassword, user.getPassword())) {
            return Response.status(Response.Status.FORBIDDEN).build(); // 403
        }
 
        // 5. GUARDAR LA NUEVA CONTRASEÑA
        // Nunca se guarda en texto plano: PasswordUtil.hash genera un hash
        // con sal aleatoria. La entidad "user" está gestionada (managed)
        // porque viene de una consulta del EntityManager, así que el cambio
        // se guarda solo al terminar la transacción.
        user.setPassword(Password.hash(req.newPassword));
 
        // 6. RESPUESTA
        // 204 = "hecho, y no tengo nada más que contarte".
        // (202 Accepted se usa cuando el trabajo aún NO ha terminado,
        // y aquí el cambio se hace de forma inmediata.)
        return Response.noContent().build();
    }
 
    /**
     * Auxiliar: true si el texto es null, está vacío o solo tiene espacios.
     */
    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
