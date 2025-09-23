package com.miapp.controller;

import com.miapp.model.VisitaBibliotecaVirtual;
import com.miapp.service.VisitaBibliotecaVirtualService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/api/visitas-biblio")
@RequiredArgsConstructor
public class VisitaBibliotecaVirtualController {

    private final VisitaBibliotecaVirtualService service;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> body) {
        try {
            String codigo = (String) body.get("codigoUsuario");
            Integer estado = Integer.parseInt(body.get("estado").toString());
            VisitaBibliotecaVirtual visita = service.registrar(codigo, estado);
            return ResponseEntity.status(HttpStatus.CREATED).body(visita);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }
}