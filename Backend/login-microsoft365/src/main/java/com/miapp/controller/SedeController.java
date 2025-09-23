package com.miapp.controller;

import com.miapp.model.Sede;
import com.miapp.service.SedeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/sede")
public class SedeController {

    private final SedeService sedeService;

    public SedeController(SedeService sedeService) {
        this.sedeService = sedeService;
    }

    @GetMapping("/lista-activo")
    public ResponseEntity<?> listarActivos() {
        try {
            List<Sede> sedes = sedeService.listActivas();
            return ResponseEntity.ok(Map.of("status", 0, "data", sedes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @GetMapping("/lista")
    public ResponseEntity<?> listarTodos() {
        List<Sede> sedes = sedeService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", sedes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Sede sede = sedeService.getById(id);
            return ResponseEntity.ok(Map.of("status", 0, "data", sede));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Sede sede) {
        try {
            Sede saved = sedeService.create(sede);
            return ResponseEntity.ok(Map.of("status", 0, "data", saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Sede sede) {
        try {
            Sede updated = sedeService.update(id, sede);
            return ResponseEntity.ok(Map.of("status", 0, "data", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            sedeService.delete(id);
            return ResponseEntity.ok(Map.of("status", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }
}