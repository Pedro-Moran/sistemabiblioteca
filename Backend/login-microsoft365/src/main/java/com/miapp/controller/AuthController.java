package com.miapp.controller;


import com.miapp.model.*;
import com.miapp.model.dto.GraphGroupDTO;
import com.miapp.model.dto.IntegracionPersonaResultDTO;
import com.miapp.model.dto.MicrosoftServiciosResponseDTO;
import com.miapp.model.dto.PerfilMicrosoftDTO;
import com.miapp.service.*;
import com.miapp.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final AzureService azureService;
    private final PerfilMicrosoftService perfilMicrosoftService;
    private final TipoDocumentoService tipoDocumentoService;
    private final EspecialidadService especialidadService;
    private final TipoMaterialService tipoMaterialService;
    private final PasswordResetService passwordResetService;
    private final VisitaBibliotecaVirtualService visitaBibliotecaVirtualService;
    private final IntegracionPersonaService integracionPersonaService;

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
     * Obtiene los servicios/perfiles desde Microsoft Graph para el usuario autenticado.
     * Se espera el token delegado emitido para el usuario (por ejemplo, obtenido mediante MSAL en el frontend).
     */
    @PostMapping("/microsoft/servicios")
    public ResponseEntity<?> obtenerServiciosMicrosoft(@RequestBody Map<String, String> request) {
        String microsoftToken = request.get("token");
        if (microsoftToken == null || microsoftToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token de Microsoft requerido"));
        }

        try {
            List<GraphGroupDTO> servicios = azureService.obtenerServiciosConTokenUsuario(microsoftToken);
            MicrosoftServiciosResponseDTO response = perfilMicrosoftService.construirRespuestaServicios(servicios);
            System.out.println("🧭 Perfiles configurados disponibles tras la consulta a Microsoft:");
            if (response.getPerfilesDisponibles() != null && !response.getPerfilesDisponibles().isEmpty()) {
                response.getPerfilesDisponibles().forEach(perfil -> {
                    if (perfil == null) {
                        return;
                    }
                    System.out.println("   • Perfil BD: " +
                            (perfil.getRolDescripcion() != null ? perfil.getRolDescripcion() : "(sin rol local)") +
                            " | Grupo: " + (perfil.getGraphGroupId() != null ? perfil.getGraphGroupId() : "(sin id)") +
                            " | Nombre Microsoft: " +
                            (perfil.getGraphGroup() != null && perfil.getGraphGroup().getDisplayName() != null
                                    ? perfil.getGraphGroup().getDisplayName()
                                    : perfil.getNombre()));
                });
            } else {
                System.out.println("   • No hay perfiles configurados vinculados al token proporcionado.");
            }
            if (response.getGruposSinConfiguracion() != null && !response.getGruposSinConfiguracion().isEmpty()) {
                System.out.println("🛈 Grupos sin configuración local detectados:");
                response.getGruposSinConfiguracion().forEach(grupo -> {
                    if (grupo == null) {
                        return;
                    }
                    System.out.println("   • " +
                            (grupo.getId() != null ? grupo.getId() : "(sin id)") +
                            " | " +
                            (grupo.getDisplayName() != null ? grupo.getDisplayName() : "(sin nombre)"));
                });
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Error al obtener servicios desde Microsoft Graph", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Error al consultar Microsoft Graph",
                            "detail", ex.getMessage()
                    ));
        }
    }

    /**
     * Endpoint para login con Office 365.
     * Se espera recibir desde el frontend el token de Office 365 obtenido (ej. mediante MSAL Angular)
     */
    @PostMapping("/login-microsoft")
    public ResponseEntity<?> loginMicrosoft(@RequestBody Map<String, String> request) {
        String microsoftToken = request.get("token");
        String requestedRole = request.get("role");
        Map<String, String> datosMicrosoft = usuarioService.validarYExtraerDatosMicrosoft(microsoftToken);

        if (datosMicrosoft == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token de Microsoft inválido"));
        }

        String email = datosMicrosoft.get("email");
        String microsoftId = datosMicrosoft.get("id");

        Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(email);

        if (usuarioOpt.isEmpty()) {
            try {
                Optional<IntegracionPersonaResultDTO> personaOpt = integracionPersonaService.obtenerInformacionPersona(email);
                if (personaOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of(
                                    "message", "Usuario no registrado",
                                    "detail", "No se encontró información en integración académica",
                                    "email", email,
                                    "microsoftId", microsoftId
                            ));
                }
                Usuario invitado = usuarioService.registrarInvitadoDesdeIntegracion(
                        email,
                        microsoftId,
                        personaOpt.get(),
                        integracionPersonaService.getCountryHeader()
                );
                usuarioOpt = Optional.of(invitado);
            } catch (ResponseStatusException ex) {
                log.error("Error al consultar integración académica para {}", email, ex);
                return ResponseEntity.status(ex.getStatusCode())
                        .body(Map.of(
                                "message", "No se pudo registrar al usuario automáticamente",
                                "detail", ex.getReason(),
                                "email", email
                        ));
            } catch (RuntimeException ex) {
                log.error("Error al registrar usuario invitado para {}", email, ex);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "message", "Error al registrar usuario automáticamente",
                                "detail", ex.getMessage()
                        ));
            }
        }

        Usuario usuario = usuarioOpt.get();

        List<GraphGroupDTO> graphGroups;
        try {
            graphGroups = azureService.obtenerServiciosConTokenUsuario(microsoftToken);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Error al validar servicios de Microsoft durante el login", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Error al validar perfiles en Microsoft 365",
                            "detail", ex.getMessage()
                    ));
        }

        MicrosoftServiciosResponseDTO serviciosResponse = perfilMicrosoftService.construirRespuestaServicios(graphGroups);
        System.out.println("🧭 Resultado de la validación de roles Microsoft durante el login:");
        if (serviciosResponse.getPerfilesDisponibles() != null && !serviciosResponse.getPerfilesDisponibles().isEmpty()) {
            serviciosResponse.getPerfilesDisponibles().forEach(perfil -> {
                if (perfil == null) {
                    return;
                }
                System.out.println("   • Perfil BD: " +
                        (perfil.getRolDescripcion() != null ? perfil.getRolDescripcion() : "(sin rol local)") +
                        " | Grupo: " + (perfil.getGraphGroupId() != null ? perfil.getGraphGroupId() : "(sin id)") +
                        " | Nombre Microsoft: " +
                        (perfil.getGraphGroup() != null && perfil.getGraphGroup().getDisplayName() != null
                                ? perfil.getGraphGroup().getDisplayName()
                                : perfil.getNombre()));
            });
        } else {
            System.out.println("   • No se encontraron perfiles configurados para los grupos de Microsoft del usuario.");
        }

        Map<String, PerfilMicrosoftDTO> perfilesDisponibles = new LinkedHashMap<>();
        serviciosResponse.getPerfilesDisponibles().stream()
                .filter(Objects::nonNull)
                .forEach(perfil -> {
                    registrarPerfilPorClave(perfilesDisponibles, perfil.getRolDescripcion(), perfil);
                    registrarPerfilPorClave(perfilesDisponibles, perfil.getNombre(), perfil);
                });

        if (perfilesDisponibles.isEmpty()) {
            System.out.println("🔎 [Microsoft] No se registraron roles provenientes de Microsoft 365 para comparar.");
        } else {
            System.out.println("🔎 [Microsoft] Roles normalizados obtenidos desde Microsoft 365:");
            perfilesDisponibles.forEach((clave, perfil) -> {
                if (perfil == null) {
                    return;
                }
                String origen = perfil.getRolDescripcion() != null ? perfil.getRolDescripcion() : perfil.getNombre();
                String grupo = perfil.getGraphGroupId() != null ? perfil.getGraphGroupId() : "(sin id)";
                System.out.println("   • clave=" + clave + " | origen=" + (origen != null ? origen : "(sin nombre)") + " | grupo=" + grupo);
            });
        }

        Set<String> rolesUsuario = usuario.getRoles().stream()
                .map(Rol::getDescripcion)
                .filter(Objects::nonNull)
                .map(valor -> valor.toUpperCase(Locale.ROOT))
                .collect(Collectors.toSet());

        if (rolesUsuario.isEmpty()) {
            System.out.println("🗄️ [Backend] El usuario no posee roles locales asociados en la base de datos.");
        } else {
            System.out.println("🗄️ [Backend] Roles locales del usuario (normalizados):");
            rolesUsuario.forEach(rol -> System.out.println("   • " + rol));
        }

        String rolDescripcion;
        if (requestedRole != null && !requestedRole.isBlank()) {
            String requestedUpper = requestedRole.toUpperCase(Locale.ROOT);
            System.out.println("🎯 Rol solicitado por el frontend: " + requestedUpper);
            PerfilMicrosoftDTO perfilSeleccionado = perfilesDisponibles.get(requestedUpper);
            if (perfilSeleccionado == null) {
                System.out.println("❌ El rol " + requestedUpper + " no coincide con ningún perfil configurado proveniente de Microsoft 365.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "El rol seleccionado no está habilitado en Microsoft 365"));
            }
            String rolConfigurado = perfilSeleccionado.getRolDescripcion();
            String rolConfiguradoUpper = rolConfigurado != null ? rolConfigurado.toUpperCase(Locale.ROOT) : null;
            if (rolConfiguradoUpper != null && !rolesUsuario.contains(rolConfiguradoUpper) && !rolesUsuario.contains(requestedUpper)) {
                System.out.println("❌ El rol " + requestedUpper + " fue validado en Microsoft, pero el usuario no cuenta con el rol local "
                        + rolConfiguradoUpper + ". Roles locales del usuario: " + rolesUsuario);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Rol no autorizado para el usuario"));
            }
            rolDescripcion = rolConfigurado != null
                    ? rolConfigurado
                    : perfilSeleccionado.getNombre() != null ? perfilSeleccionado.getNombre() : requestedRole;
            System.out.println("✅ Rol autorizado tras validar Microsoft y backend: " + rolDescripcion);
        } else {
            rolDescripcion = perfilesDisponibles.values().stream()
                    .map(PerfilMicrosoftDTO::getRolDescripcion)
                    .filter(Objects::nonNull)
                    .filter(valor -> rolesUsuario.contains(valor.toUpperCase(Locale.ROOT)))
                    .findFirst()
                    .orElseGet(() -> usuario.getRoles().stream()
                            .filter(r -> r.getDescripcion() != null && r.getDescripcion().equalsIgnoreCase("ESTUDIANTE"))
                            .findFirst()
                            .map(Rol::getDescripcion)
                            .orElseGet(() -> usuario.getRoles().stream()
                                    .findFirst()
                                    .map(Rol::getDescripcion)
                                    .orElse("Sin Rol")));
            System.out.println("🤖 Rol seleccionado automáticamente para el token de Microsoft: " + rolDescripcion);
        }

        usuarioService.incrementarContadorLogins(usuario.getLogin());
        registrarVisitaIngreso(usuario);
        String jwt = jwtUtil.generateToken(usuario.getEmail(), rolDescripcion);

        RefreshToken refresh = refreshTokenService.createRefreshToken(usuario);

        return ResponseEntity.ok(new LoginResponse("Login exitoso", jwt, refresh.getToken()));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginManual(@RequestBody LoginRequest loginRequest) {
        String emailUpper = loginRequest.getEmail().toUpperCase();
        Optional<Usuario> usuarioOpt = usuarioService.validarCredenciales(emailUpper, loginRequest.getPassword());
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            String requestedRole = loginRequest.getRole();
            boolean hasRole = usuario.getRoles().stream()
                    .anyMatch(r -> r.getDescripcion().equalsIgnoreCase(requestedRole));
            if (!hasRole) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Rol no autorizado"));
            }
            usuarioService.incrementarContadorLogins(usuario.getLogin());
            registrarVisitaIngreso(usuario);
            String jwt = jwtUtil.generateToken(usuario.getEmail(), requestedRole);
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
        String email = request.get("email").toUpperCase();
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
            // Se retorna 200 para que el frontend pueda manejar el mensaje de validación
            return ResponseEntity.ok(Map.of("p_status", -1, "p_mensaje", e.getMessage()));
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
            // Se retorna 200 para permitir que el frontend muestre el mensaje de error
            return ResponseEntity.ok(Map.of(
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

    @GetMapping("/permisosRolPorUsuarioEmail/{email}")
    public ResponseEntity<?> getPermisosRolPorUsuarioEmail(@PathVariable String email) {
        try {
            Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(email.toUpperCase());
            if (usuarioOpt.isPresent()) {
                List<Rol> rolesAsignados = List.copyOf(usuarioOpt.get().getRoles());
                return ResponseEntity.ok(Map.of("status", "0", "data", rolesAsignados));
            } else {
                return ResponseEntity.ok(Map.of("status", "0", "data", Collections.emptyList()));
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

    private void registrarPerfilPorClave(Map<String, PerfilMicrosoftDTO> perfilesDisponibles,
                                         String clave,
                                         PerfilMicrosoftDTO perfil) {
        if (clave == null || perfil == null) {
            return;
        }
        String normalizada = clave.trim();
        if (normalizada.isEmpty()) {
            return;
        }
        perfilesDisponibles.putIfAbsent(normalizada.toUpperCase(Locale.ROOT), perfil);
    }

    private void registrarVisitaIngreso(Usuario usuario) {
        if (usuario == null) {
            return;
        }
        visitaBibliotecaVirtualService.registrarIngresoAutomatico(usuario)
                .ifPresent(visita -> log.debug("Visita virtual {} registrada para {}", visita.getId(), visita.getCodigoUsuario()));
    }

}