package com.miapp.config;

import com.miapp.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

//@Component
//@RequiredArgsConstructor
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain) throws IOException, jakarta.servlet.ServletException {
//
//        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            try {
//                String username = jwtUtil.validateToken(token);
//                // Si el token es válido, creamos la autenticación
//                UsernamePasswordAuthenticationToken authentication =
//                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//            } catch (JwtException e) {
//                // Token inválido, opcionalmente puedes lanzar error o continuar
//                // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido");
//            }
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}
