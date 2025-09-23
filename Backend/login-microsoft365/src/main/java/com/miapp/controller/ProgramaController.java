package com.miapp.controller;

import com.miapp.model.Programa;
import com.miapp.service.ProgramaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/programa")
public class ProgramaController {

    private final ProgramaService programaService;

    public ProgramaController(ProgramaService programaService) {
        this.programaService = programaService;
    }

    @GetMapping("/lista-activo")
    public ResponseEntity<?> listarActivos() {
        List<Programa> programas = programaService.listActivos();
        return ResponseEntity.ok(Map.of("status", 0, "data", programas));
    }

    @GetMapping("/lista")
    public ResponseEntity<?> listarTodos() {
        List<Programa> programas = programaService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", programas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Programa programa = programaService.getById(id);
            return ResponseEntity.ok(Map.of("status", 0, "data", programa));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Programa programa) {
        try {
            Programa saved = programaService.create(programa);
            return ResponseEntity.ok(Map.of("status", 0, "data", saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Programa programa) {
        try {
            Programa updated = programaService.update(id, programa);
            return ResponseEntity.ok(Map.of("status", 0, "data", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            programaService.delete(id);
            return ResponseEntity.ok(Map.of("status", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }
}