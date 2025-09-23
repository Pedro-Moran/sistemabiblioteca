package com.miapp.controller;

import com.miapp.model.MotivoAccion;
import com.miapp.service.MotivoAccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/motivoaccion")
public class MotivoAccionController {

    private final MotivoAccionService motivoAccionService;

    public MotivoAccionController(MotivoAccionService motivoAccionService) {
        this.motivoAccionService = motivoAccionService;
    }

    @GetMapping("/lista-activo")
    public ResponseEntity<?> listarActivos() {
        List<MotivoAccion> motivos = motivoAccionService.listActivos();
        return ResponseEntity.ok(Map.of("status", 0, "data", motivos));
    }

    @GetMapping("/lista")
    public ResponseEntity<?> listarTodos() {
        List<MotivoAccion> motivos = motivoAccionService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", motivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            MotivoAccion motivo = motivoAccionService.getById(id);
            return ResponseEntity.ok(Map.of("status", 0, "data", motivo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MotivoAccion motivo) {
        try {
            MotivoAccion saved = motivoAccionService.create(motivo);
            return ResponseEntity.ok(Map.of("status", 0, "data", saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody MotivoAccion motivo) {
        try {
            MotivoAccion updated = motivoAccionService.update(id, motivo);
            return ResponseEntity.ok(Map.of("status", 0, "data", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            motivoAccionService.delete(id);
            return ResponseEntity.ok(Map.of("status", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }
}