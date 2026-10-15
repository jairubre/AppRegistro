/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
 
/**
 * CLASE COMPARTIDA POR LOS 3 (sign up, sign in y change password).
 * - Sign up   -> PasswordUtil.hash(password)            antes de guardar
 * - Sign in   -> PasswordUtil.verify(password, hash)    para comprobar
 * - Change    -> las dos
 *
 * Formato guardado en la columna "password": iteraciones:salt:hash (Base64).
 * Ocupa unos 80 caracteres, cabe en VARCHAR(255).
 */
public final class Password {
 
    private static final int ITERATIONS = 210_000;
    private static final int KEY_BITS = 256;
 
    private Password() {
    }
 
    public static String hash(String password) {
        try {
            byte[] salt = new byte[16];
            new SecureRandom().nextBytes(salt);
            byte[] h = pbkdf2(password.toCharArray(), salt, ITERATIONS);
            return ITERATIONS + ":" + Base64.getEncoder().encodeToString(salt)
                    + ":" + Base64.getEncoder().encodeToString(h);
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo calcular el hash", e);
        }
    }
 
    public static boolean verify(String password, String stored) {
        try {
            if (password == null || stored == null) {
                return false;
            }
            String[] parts = stored.split(":");
            if (parts.length != 3) {
                return false;
            }
            int iter = Integer.parseInt(parts[0]);
            byte[] salt = Base64.getDecoder().decode(parts[1]);
            byte[] expected = Base64.getDecoder().decode(parts[2]);
            byte[] actual = pbkdf2(password.toCharArray(), salt, iter);
            return MessageDigest.isEqual(expected, actual); // tiempo constante
        } catch (Exception e) {
            return false;
        }
    }
 
    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, KEY_BITS);
        return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
    }
}
