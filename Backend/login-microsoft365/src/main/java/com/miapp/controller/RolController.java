package com.miapp.controller;

import com.miapp.model.Rol;
import com.miapp.repository.RolRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/roles")
public class RolController {

    private final RolRepository rolRepository;

    public RolController(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @GetMapping("/lista-roles")
    public ResponseEntity<?> listaRoles() {
        try {
            List<Rol> roles = rolRepository.findAll();
            // Retornamos un mapa con status "0" para indicar éxito y la lista de roles
            return ResponseEntity.ok(Map.of("status", "0", "data", roles));
        } catch (Exception e) {
            // En caso de error se retorna un mensaje y status "-1"
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "-1", "message", "Error al cargar roles: " + e.getMessage()));
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarRol(@RequestBody Map<String, Object> payload) {
        try {
            Long id = payload.get("id") != null ? Long.valueOf(payload.get("id").toString()) : 0L;
            String descripcion = payload.get("descripcion").toString();

            // Evita duplicados cuando se registra un nuevo rol
            if (id == 0 && rolRepository.findByDescripcion(descripcion).isPresent()) {
                return ResponseEntity.ok(
                        Map.of("p_status", -1, "p_mensaje", "La descripción del rol ya existe"));
            }

            Rol rol = (id > 0) ? rolRepository.findById(id).orElse(new Rol()) : new Rol();
            rol.setDescripcion(descripcion);
            Rol guardado = rolRepository.save(rol);

            return ResponseEntity.ok(
                    Map.of("p_status", 0, "p_mensaje", "Rol registrado correctamente", "data", guardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }
}
