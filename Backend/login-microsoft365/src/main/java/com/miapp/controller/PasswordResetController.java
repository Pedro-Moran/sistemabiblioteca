package com.miapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import com.miapp.service.PasswordResetService;
import com.miapp.service.UsuarioService;

import java.util.Map;

/**
 * Endpoint público para procesar enlaces de restablecimiento de contraseña.
 * Valida el token recibido y devuelve una respuesta sencilla.
 * En una implementación real se debería verificar el token y permitir
 * establecer una nueva contraseña.
 */
@RestController
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final UsuarioService usuarioService;

    @GetMapping("/reset-password")
    public ResponseEntity<Map<String, String>> validateToken(@RequestParam String token) {
        if (passwordResetService.isValid(token)) {
            return ResponseEntity.ok(Map.of("message", "Token válido"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Token inválido o expirado"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        return passwordResetService.consumeToken(token)
                .map(usuario -> {
                    usuarioService.actualizarPassword(usuario, newPassword);
                    return ResponseEntity.ok(Map.of("message", "Contraseña actualizada"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Token inválido o expirado")));
    }
}