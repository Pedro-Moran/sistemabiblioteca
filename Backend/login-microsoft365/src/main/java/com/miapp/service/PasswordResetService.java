package com.miapp.service;

import com.miapp.model.PasswordResetToken;
import com.miapp.model.Usuario;
import com.miapp.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Servicio para gestionar tokens de restablecimiento de contraseña
 * persistidos en base de datos con fecha de expiración.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;

    @Value("${app.reset-token-expiration-minutes:30}")
    private long expirationMinutes;

    public String createToken(Usuario usuario) {
        tokenRepository.deleteByUsuario(usuario);
        PasswordResetToken token = new PasswordResetToken();
        token.setUsuario(usuario);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusMinutes(expirationMinutes));
        tokenRepository.save(token);
        return token.getToken();
    }

    public boolean isValid(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> t.getExpiryDate().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    public Optional<Usuario> consumeToken(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> t.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(t -> {
                    Usuario usuario = t.getUsuario();
                    tokenRepository.delete(t);
                    return usuario;
                });
    }
}