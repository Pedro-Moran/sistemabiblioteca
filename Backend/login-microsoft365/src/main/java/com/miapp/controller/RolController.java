package com.miapp.controller;

import com.miapp.model.Modulo;
import com.miapp.model.Rol;
import com.miapp.repository.ModuloRepository;
import com.miapp.repository.RolRepository;
import com.miapp.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/roles")
public class RolController {

    private final RolRepository rolRepository;
    private final ModuloRepository moduloRepository;
    private final UsuarioRepository usuarioRepository;

    public RolController(RolRepository rolRepository,
                         ModuloRepository moduloRepository,
                         UsuarioRepository usuarioRepository) {
        this.rolRepository = rolRepository;
        this.moduloRepository = moduloRepository;
        this.usuarioRepository = usuarioRepository;
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

            Object descObj = payload.get("descripcion");
            if (descObj == null || descObj.toString().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("p_status", -1, "p_mensaje", "La descripción del rol es obligatoria"));
            }
            String descripcion = descObj.toString();

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

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarRol(@PathVariable Long id) {
        try {
            if (id == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("p_status", -1, "p_mensaje", "El ID del rol es obligatorio"));
            }
            if (!rolRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("p_status", -1, "p_mensaje", "Rol no encontrado"));
            }
            moduloRepository.removeAllModulosFromRol(id);
            usuarioRepository.removeRolFromUsuarios(id);
            rolRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Rol eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }
    @GetMapping("/lista-rolmodulos/{idRol}")
    public ResponseEntity<?> listaRolModulos(@PathVariable Long idRol) {
        try {
            List<Modulo> modulos = moduloRepository.findByRol(idRol);
            return ResponseEntity.ok(Map.of("status", "0", "data", modulos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "-1", "message", "Error al cargar módulos: " + e.getMessage()));
        }
    }

    @GetMapping("/lista-rolmodulos-desc/{descripcion}")
    public ResponseEntity<?> listaRolModulosPorDescripcion(@PathVariable String descripcion) {
        try {
            return rolRepository.findByDescripcion(descripcion)
                    .map(rol -> ResponseEntity.ok(Map.of(
                            "status", "0",
                            "data", moduloRepository.findByRol(rol.getIdRol())
                    )))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("status", "-1", "message", "Rol no encontrado")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "-1", "message", "Error al cargar módulos: " + e.getMessage()));
        }
    }

    @PostMapping("/agregar-modulo")
    public ResponseEntity<?> agregarModulo(@RequestBody Map<String, Long> payload, Principal principal) {
        try {
            Long idRol = payload.get("idrol");
            Long idModulo = payload.get("idmodulo");
            Long idUsuario = payload.get("idusuario");

            if (idUsuario == null || idUsuario <= 0) {
                String login = principal.getName();
                idUsuario = usuarioRepository.findByEmailIgnoreCase(login)
                        .or(() -> usuarioRepository.findByLoginIgnoreCase(login))
                        .map(u -> u.getIdUsuario())
                        .orElse(null);
            }

            if (idUsuario == null || !usuarioRepository.existsById(idUsuario)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("p_status", -1, "p_mensaje", "Usuario no encontrado"));
            }

            moduloRepository.addModuloToRol(idRol, idModulo, idUsuario);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Módulo agregado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/quitar-modulo")
    public ResponseEntity<?> quitarModulo(@RequestBody Map<String, Long> payload) {
        try {
            Long idRol = payload.get("idrol");
            Long idModulo = payload.get("idmodulo");
            moduloRepository.removeModuloFromRol(idRol, idModulo);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Módulo eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }
}
