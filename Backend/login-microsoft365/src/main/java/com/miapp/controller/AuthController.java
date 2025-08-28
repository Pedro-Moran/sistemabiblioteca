package com.miapp.controller;


import com.miapp.model.*;
import com.miapp.repository.RolRepository;
import com.miapp.service.*;
import com.miapp.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final AzureService azureService;
    private final TipoDocumentoService tipoDocumentoService;
    private final EspecialidadService especialidadService;
    private final TipoMaterialService tipoMaterialService;
    private final PasswordResetService passwordResetService;

    /**
     * Endpoint al que redirige Azure AD después de un login exitoso.
     * Podrías usarlo para generar un token JWT, o simplemente mostrar info.
     */
//    @GetMapping("/success")
//    public String success(Authentication authentication) {
//        // 'authentication' tendrá información del usuario proveniente de Azure AD
//        // Por ejemplo, el 'principal' con claims de Azure
//        if (authentication == null) {
//            return "No hay autenticación";
//        }
//        // Aquí podrías extraer el correo del usuario de Azure AD, etc.
//        // Generar un token JWT si quieres:
//        String username = authentication.getName(); // normalment userPrincipal name
//        String token = usuarioService.generarTokenJWT(username);
//
//        return "Login exitoso con Azure AD. Token JWT: " + token;
//    }

    /**
     * Ejemplo de endpoint protegido que requiere JWT (después de la autenticación).
     * Muestra cómo recuperar el usuario del token.
     */
    @GetMapping("/perfil")
    public String perfil(Authentication authentication) {
        if (authentication != null) {
            return "Perfil del usuario: " + authentication.getName();
        } else {
            return "No autenticado.";
        }
    }

    // Endpoint usando azure-identity
    @PostMapping("/addUserToGroupAzureIdentity")
    public ResponseEntity<String> addUserToGroupAzureIdentity(@RequestParam String userId,
                                                              @RequestParam String groupId) {
        try {
            System.out.println("🔹 Llamando a addUserToGroupAzureIdentity con userId: " + userId + " y groupId: " + groupId);
            azureService.addUserToGroupWithAzureIdentity(userId, groupId);
            return ResponseEntity.ok("Usuario agregado al grupo exitosamente (azure-identity).");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al agregar usuario con azure-identity: " + e.getMessage());
        }
    }

    // Endpoint usando MSAL4J
    @PostMapping("/addUserToGroupMsal4j")
    public ResponseEntity<String> addUserToGroupMsal4j(@RequestParam String userId,
                                                       @RequestParam String groupId) {
        try {
            System.out.println("🔹 Llamando a addUserToGroupMsal4j con userId: " + userId + " y groupId: " + groupId);
            azureService.addUserToGroupWithMsal4j(userId, groupId);
            return ResponseEntity.ok("Usuario agregado al grupo exitosamente (MSAL4J).");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al agregar usuario con MSAL4J: " + e.getMessage());
        }
    }

    /**
     * Endpoint para login con Office 365.
     * Se espera recibir desde el frontend el token de Office 365 obtenido (ej. mediante MSAL Angular)
     */
    @PostMapping("/login-microsoft")
    public ResponseEntity<?> loginMicrosoft(@RequestBody Map<String, String> request) {
        String microsoftToken = request.get("token");
        Map<String, String> datosMicrosoft = usuarioService.validarYExtraerDatosMicrosoft(microsoftToken);

        if (datosMicrosoft == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token de Microsoft inválido"));
        }

        String email = datosMicrosoft.get("email");
        String microsoftId = datosMicrosoft.get("id");

        Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(email);

        if (usuarioOpt.isEmpty()) {
            Usuario usuario = usuarioService.registrarDesdeOffice365(email, microsoftId);
            usuarioService.incrementarContadorLogins(usuario.getLogin());
            String rolDescripcion = usuario.getRoles().isEmpty()
                    ? "Sin Rol"
                    : usuario.getRoles().iterator().next().getDescripcion();
            String jwt = jwtUtil.generateToken(usuario.getEmail(), rolDescripcion);
            RefreshToken refresh = refreshTokenService.createRefreshToken(usuario);
            return ResponseEntity.ok(new LoginResponse("Registro y login exitoso", jwt, refresh.getToken()));
        }

        Usuario usuario = usuarioOpt.get();
        String rolDescripcion = usuario.getRoles().isEmpty()
                ? "Sin Rol"
                : usuario.getRoles().iterator().next().getDescripcion();
        usuarioService.incrementarContadorLogins(usuario.getLogin());
        String jwt = jwtUtil.generateToken(usuario.getEmail(), rolDescripcion);

        RefreshToken refresh = refreshTokenService.createRefreshToken(usuario);

        return ResponseEntity.ok(new LoginResponse("Login exitoso", jwt, refresh.getToken()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginManual(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioService.validarCredenciales(loginRequest.getEmail(), loginRequest.getPassword());
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            String rolDescripcion = usuario.getRoles().isEmpty()
                    ? "Sin Rol"
                    : usuario.getRoles().iterator().next().getDescripcion();
            usuarioService.incrementarContadorLogins(usuario.getLogin());
            String jwt = jwtUtil.generateToken(usuario.getEmail(), rolDescripcion);
            RefreshToken refresh = refreshTokenService.createRefreshToken(usuario);
            System.out.println(jwt);
            return ResponseEntity.ok(new LoginResponse("Login exitoso", jwt, refresh.getToken()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales incorrectas");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return usuarioService.buscarPorEmail(email)
                .map(usuario -> {
                    String token = passwordResetService.createToken(usuario);
                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "message", "Token generado"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Correo no encontrado")));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        return refreshTokenService.findByToken(refreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(rt -> {
                    Usuario usuario = rt.getUsuario();
                    String rol = usuario.getRoles().isEmpty() ? "Sin Rol" : usuario.getRoles().iterator().next().getDescripcion();
                    String access = jwtUtil.generateToken(usuario.getEmail(), rol);
                    refreshTokenService.deleteByUsuario(usuario);
                    RefreshToken newToken = refreshTokenService.createRefreshToken(usuario);
                    return ResponseEntity.ok(new LoginResponse("Token refrescado", access, newToken.getToken()));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse("Refresh token inválido", null, null)));
    }

    // Endpoint de registro público para auto-registro
    @PostMapping("/register")
    public ResponseEntity<?> registerPublic(@RequestBody Usuario usuario) {
        try {
            // En el auto-registro se asigna por defecto el rol "USUARIO" y un usuarioCreacion predeterminado
            usuario.setUsuarioCreacion("auto-registrado");
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Usuario registrado exitosamente", "data", nuevoUsuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    // Endpoint de registro administrado (protegido)
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Usuario usuario, Authentication authentication) {
        System.out.println(authentication.getName());
        try {
            // Aquí se asume que el usuario autenticado es un administrador.
            // Se asigna el email del admin que realiza la acción
            usuario.setUsuarioCreacion(authentication.getName());
            // Además, se pueden asignar roles y otras configuraciones según se requiera
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Usuario registrado exitosamente por el administrador", "data", nuevoUsuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @GetMapping("/listaPorRol/{idrol}")
    public ResponseEntity<?> listaPorRol(@PathVariable("idrol") Long idrol) {
        try {
            List<Usuario> usuarios = usuarioService.getUsuariosPorRol(idrol);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "0");
            response.put("data", usuarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "-1");
            errorResponse.put("message", "Error al obtener usuarios");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/lista-activo")
    public ResponseEntity<?> listaActivos() {
        try {
            List<TipoDocumento> lista = tipoDocumentoService.getActivos();
            return ResponseEntity.ok(Map.of("status", "0", "data", lista));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "1", "mensaje", "Error al obtener tipo de documentos"));
        }
    }

    @PostMapping("/registrar/especialidad")
    public ResponseEntity<?> createEspecialidad(@RequestBody Especialidad especialidad) {
        try {
            Especialidad saved = especialidadService.save(especialidad);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Especialidad registrada exitosamente", "data", saved));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", "Error al registrar especialidad: " + e.getMessage()));
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarUsuario(@RequestBody Usuario usuario) {
        try {
            System.out.println("Actualizar "+usuario);
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(usuario);
            // Se envía una respuesta con un formato similar al de registro
            return ResponseEntity.ok(
                    Map.of(
                            "p_status", 0,
                            "p_mensaje", "Registro actualizado correctamente.",
                            "data", usuarioActualizado
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "p_status", -1,
                            "p_mensaje", e.getMessage()
                    ));
        }
    }

    @GetMapping("/permisosRolPorUsuario/{idusuario}/{accion}")
    public ResponseEntity<?> getPermisosRolPorUsuario(@PathVariable Long idusuario, @PathVariable Integer accion) {
        try {
            if (accion == 1) {
                // Roles asignados
                List<Rol> rolesAsignados = usuarioService.getRolesAsignados(idusuario);
                return ResponseEntity.ok(Map.of("status", "0", "data", rolesAsignados));
            } else if (accion == 2) {
                // Roles disponibles (no asignados)
                List<Rol> rolesDisponibles = usuarioService.getRolesNoAsignados(idusuario);
                return ResponseEntity.ok(Map.of("status", "0", "data", rolesDisponibles));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "-1", "message", "Acción no válida"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "-1", "message", e.getMessage()));
        }
    }

    @PostMapping("/agregar-rol")
    public ResponseEntity<?> agregarRol(@RequestBody Map<String, Object> payload) {
        try {
            Long idrol = Long.valueOf(payload.get("idrol").toString());
            Long idusuario = Long.valueOf(payload.get("idusuario").toString());
            usuarioService.agregarRolUsuario(idusuario, idrol);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Rol agregado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @PostMapping("/quitar-rol")
    public ResponseEntity<?> quitarRol(@RequestBody Map<String, Object> payload) {
        try {
            Long idrol = Long.valueOf(payload.get("idrol").toString());
            Long idusuario = Long.valueOf(payload.get("idusuario").toString());
            usuarioService.quitarRolUsuario(idusuario, idrol);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Rol eliminado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<?> deleteUsuario(@RequestBody Map<String, Object> payload) {
        try {
            Long id = Long.valueOf(payload.get("id").toString());
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Registro eliminado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @PutMapping("/activo")
    public ResponseEntity<?> cambiarEstadoUsuario(@RequestBody Map<String, Object> payload) {
        try {
            Long id = Long.valueOf(payload.get("id").toString());
            // Se espera que en el payload se envíe el nuevo estado como cadena: "ACTIVO" o "DESACTIVADO"
            String estado = payload.get("idEstado").toString();
            System.out.println("veeeeeeeeer: " +id);
            System.out.println("veeeeeeeeer222222: " +estado);
            usuarioService.cambiarEstadoUsuario(id, estado);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Estado actualizado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            System.out.println("Ver registro: " +usuario);
            // Si el id es 0, se interpreta como nuevo usuario, por lo que lo dejamos en null.
            if (usuario.getIdUsuario() != null && usuario.getIdUsuario() == 0) {
                usuario.setIdUsuario(null);
            }
            Usuario nuevoUsuario = usuarioService.registrar(usuario);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_mensaje", "Usuario registrado exitosamente", "data", nuevoUsuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
        }
    }

    @GetMapping("/material-bibliografico/list")
    public ResponseEntity<?> listTipoMaterial() {
        // Puedes usar listAll() o listActivos() según lo requieras
        List<TipoMaterial> lista = tipoMaterialService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }


}
