package com.miapp.controller;

import com.miapp.model.Especialidad;
import com.miapp.service.EspecialidadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/especialidad")
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    @GetMapping("/lista-activo")
    public ResponseEntity<?> listarActivos() {
        List<Especialidad> lista = especialidadService.listActivas();
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    @GetMapping("/lista")
    public ResponseEntity<?> listarTodos() {
        List<Especialidad> lista = especialidadService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Especialidad especialidad = especialidadService.getById(id);
            return ResponseEntity.ok(Map.of("status", 0, "data", especialidad));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Especialidad especialidad) {
        try {
            Especialidad saved = especialidadService.create(especialidad);
            return ResponseEntity.ok(Map.of("status", 0, "data", saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Especialidad especialidad) {
        try {
            Especialidad updated = especialidadService.update(id, especialidad);
            return ResponseEntity.ok(Map.of("status", 0, "data", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            especialidadService.delete(id);
            return ResponseEntity.ok(Map.of("status", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }
}
