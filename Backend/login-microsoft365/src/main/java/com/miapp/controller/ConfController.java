package com.miapp.controller;

import com.miapp.model.Modulo;
import com.miapp.repository.ModuloRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/conf")
public class ConfController {

    private final ModuloRepository moduloRepository;

    public ConfController(ModuloRepository moduloRepository) {
        this.moduloRepository = moduloRepository;
    }

    @GetMapping("/lista-modulos")
    public ResponseEntity<?> listaModulos() {
        try {
            List<Modulo> modulos = moduloRepository.findAll();
            return ResponseEntity.ok(Map.of("status", "0", "data", modulos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "-1", "message", "Error al cargar módulos: " + e.getMessage()));
        }
    }
}