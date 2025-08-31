package com.miapp.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // Tiempo de expiración del token de acceso (24 h por defecto)
    @Value("${jwt.expiration-ms:86400000}")
    private long accessExpirationMs;

    // Tiempo de expiración del refresh token (7 días por defecto)
    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    /**
     * Genera un token JWT con el 'username' como subject.
     */
//    public String generateToken(String login) {
//        return JWT.create()
//                .withSubject(login)
//                .withIssuedAt(new Date())
//                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
//                .sign(Algorithm.HMAC256(secret));
//    }
    public String generateToken(String username, String role) {
        return generateToken(username, role, accessExpirationMs);
    }

    public String generateToken(String username, String role, long expiration) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setAllowedClockSkewSeconds(30) // Permite 30 segundos de diferencia
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            // El token es inválido
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

<<<<<<< HEAD
=======
    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    /**
     * Valida un token JWT y retorna el username si es válido, sino lanza excepción.
     */
//    public String validateToken(String token) {
//        try {
//            Key key = Keys.hmacShaKeyFor(secret.getBytes());
//            Jws<Claims> claims = Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token);
//            return claims.getBody().getSubject();
//        } catch (JwtException e) {
//            throw new RuntimeException("Token JWT inválido o expirado.");
//        }
//    }
}
