package com.miapp.controller;

import com.miapp.model.ProgramaAccion;
import com.miapp.service.ProgramaAccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/programaaccion")
public class ProgramaAccionController {

    private final ProgramaAccionService programaAccionService;

    public ProgramaAccionController(ProgramaAccionService programaAccionService) {
        this.programaAccionService = programaAccionService;
    }

    @GetMapping("/lista-activo")
    public ResponseEntity<?> listarActivos() {
        List<ProgramaAccion> programas = programaAccionService.listActivos();
        return ResponseEntity.ok(Map.of("status", 0, "data", programas));
    }

    @GetMapping("/lista")
    public ResponseEntity<?> listarTodos() {
        List<ProgramaAccion> programas = programaAccionService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", programas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            ProgramaAccion programa = programaAccionService.getById(id);
            return ResponseEntity.ok(Map.of("status", 0, "data", programa));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ProgramaAccion programa) {
        try {
            ProgramaAccion saved = programaAccionService.create(programa);
            return ResponseEntity.ok(Map.of("status", 0, "data", saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProgramaAccion programa) {
        try {
            ProgramaAccion updated = programaAccionService.update(id, programa);
            return ResponseEntity.ok(Map.of("status", 0, "data", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            programaAccionService.delete(id);
            return ResponseEntity.ok(Map.of("status", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }
}