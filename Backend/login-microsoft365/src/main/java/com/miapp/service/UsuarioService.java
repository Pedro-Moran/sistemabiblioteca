package com.miapp.service;

import com.miapp.model.Rol;
import com.miapp.model.TipoDocumento;
import com.miapp.model.Usuario;
import com.miapp.model.dto.IntegracionPersonaDetalleDTO;
import com.miapp.model.dto.IntegracionPersonaResultDTO;
import com.miapp.repository.RolRepository;
import com.miapp.repository.TipoDocumentoRepository;
import com.miapp.repository.UsuarioRepository;
import com.miapp.util.JwtUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AzureService azureService;
    private final RolRepository rolRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          AzureService azureService,
                          RolRepository rolRepository,
                          TipoDocumentoRepository tipoDocumentoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.azureService = azureService;
        this.rolRepository = rolRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    // Método para registrar usuario manualmente
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getIdUsuario() != null && usuario.getIdUsuario() == 0) {
            usuario.setIdUsuario(null);
        } else if (usuario.getIdUsuario() != null && !usuarioRepository.existsById(usuario.getIdUsuario())) {
            // Si el ID enviado no existe en la base de datos, se trata como un nuevo registro
            usuario.setIdUsuario(null);
        }

        System.out.println(usuario.getEmail());
        // Verificar si el email ya existe (sin importar mayúsculas/minúsculas)
        if (usuarioRepository.findByEmailIgnoreCase(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya existe.");
        }
        // Verificar si el número de documento ya existe
        if (usuario.getNumDocumento() != null &&
                usuarioRepository.findByNumDocumento(usuario.getNumDocumento()).isPresent()) {
            throw new RuntimeException("El número de documento ya existe.");
        }
        // Establecer el login como email
        usuario.setLogin(usuario.getEmail());

        // Codificar la contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // Establecer la fecha de creación y el usuario de creación
//        usuario.setFechaCreacion(LocalDateTime.now());
//        if (usuario.getUsuarioCreacion() == null || usuario.getUsuarioCreacion().isBlank()) {
//            usuario.setUsuarioCreacion(usuario.getEmail());
//        }

        // Inicializar campos de modificación (al crear, aún no se modificó)
        usuario.setFechaModificacion(null);
        usuario.setUsuarioModificacion(null);

        // Establecer el estado por defecto, si no se ha enviado (por ejemplo, "ACTIVO")
        if (usuario.getIdEstado() == null || usuario.getIdEstado().isBlank()) {
            usuario.setIdEstado("ACTIVO");
        }

        // Asignar el rol por defecto 'USUARIO' si no se asignó ningún rol
        if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
            Rol rol = rolRepository.findByDescripcion("USUARIO")
                    .orElseThrow(() -> new RuntimeException("Rol 'USUARIO' no encontrado"));
            usuario.getRoles().add(rol);
        }

        if (usuario.getTipodocumento() == null || usuario.getTipodocumento().getIdTipoDocumento() == null) {
            // Por ejemplo, asignamos el tipo de documento con ID 1 como default
            TipoDocumento defaultTipoDocumento = tipoDocumentoRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("Tipo de documento default no encontrado"));
            usuario.setTipodocumento(defaultTipoDocumento);
        }

        // Los demás campos como:
        // idSede, nombreUsuario, apellidoPaterno, apellidoMaterno, fechaNacimiento, emailPersonal,
        // horaTrabajo, tipodocumento, numDocumento, telefono y direccion se guardan según lo enviado.

        return usuarioRepository.save(usuario);
    }

    // Método para validar credenciales en login manual
    public Optional<Usuario> validarCredenciales(String email, String rawPassword) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailIgnoreCase(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (passwordEncoder.matches(rawPassword, usuario.getPassword())) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }

    public void actualizarPassword(Usuario usuario, String nuevaPassword) {
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }

    // Buscar usuario por email
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email);
    }

    public boolean usuarioPerteneceAlTenant(String email) {
        return azureService.usuarioPerteneceAlTenant(email);
    }

    /**
     * Método que registra un usuario que se autentica con Office 365.
     * Se utiliza el email del usuario y se usa el microsoftId encriptado como contraseña.
     */
    public Usuario registrarDesdeOffice365(String email, String microsoftId) {
        Usuario usuario = new Usuario();
        // El login será el correo corporativo
        usuario.setLogin(email);
        usuario.setEmail(email);
        // Se usa el ID de Microsoft como contraseña encriptada
        usuario.setPassword(passwordEncoder.encode(microsoftId));

        // Asignar rol "USUARIO" por defecto
        Rol rolUsuario = rolRepository.findByDescripcion("USUARIO")
                .orElseThrow(() -> new RuntimeException("Rol 'USUARIO' no encontrado"));
        usuario.getRoles().add(rolUsuario);

        // Estado activo por defecto
        usuario.setIdEstado("ACTIVO");

        // Guardar en base de datos
        return usuarioRepository.save(usuario);
    }

    public Usuario registrarInvitadoDesdeIntegracion(String email,
                                                     String microsoftId,
                                                     IntegracionPersonaResultDTO persona,
                                                     String country) {
        Usuario usuario = new Usuario();
        usuario.setLogin(email);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(microsoftId));
        usuario.setIdEstado("ACTIVO");

        Rol rolInvitado = rolRepository.findByDescripcion("INVITADO")
                .orElseThrow(() -> new RuntimeException("Rol 'INVITADO' no encontrado"));
        usuario.getRoles().add(rolInvitado);

        if (persona != null) {
            usuario.setNombreUsuario(persona.getNombre());
            usuario.setApellidoPaterno(persona.getApellidoPaterno());
            usuario.setApellidoMaterno(persona.getApellidoMaterno());
            usuario.setEmailInst(persona.getCorreo());
            usuario.setEmplid(persona.getEmplId());
            usuario.setNationalIdType(persona.getNacionalidadTipo());
            usuario.setNationalId(persona.getNacionalidadId());
            usuario.setName(construirNombreCompleto(persona.getNombre(),
                    persona.getApellidoPaterno(), persona.getApellidoMaterno()));
            usuario.setFecNac(persona.getFechaNacimiento());
            usuario.setSex(persona.getSexo());
            usuario.setCountry(country);
            usuario.setUsuarioCreacion("MICROSOFT 365");

            if (persona.getFechaNacimiento() != null && !persona.getFechaNacimiento().isBlank()) {
                try {
                    LocalDate nacimiento = LocalDate.parse(persona.getFechaNacimiento());
                    usuario.setFechaNacimiento(nacimiento.atStartOfDay());
                    usuario.setAge(Period.between(nacimiento, LocalDate.now()).getYears());
                } catch (DateTimeParseException ignored) {
                    // Se omite el cálculo si el formato de fecha no es válido
                }
            }

            if (persona.getDetalleInformacionAcademica() != null) {
                persona.getDetalleInformacionAcademica().stream()
                        .filter(Objects::nonNull)
                        .findFirst()
                        .ifPresent(detalle -> asignarDetalleAcademico(usuario, detalle));
            }
        }

        return usuarioRepository.save(usuario);
    }

    /**
     * Método simulado para validar el token de Microsoft y extraer datos.
     * En una implementación real, deberías utilizar el SDK o librerías para validar
     * el token y extraer el email y un identificador único.
     */
    public Map<String, String> validarYExtraerDatosMicrosoft(String token) {
        try {
            DecodedJWT decoded = JWT.decode(token);

            String email = Stream.of("preferred_username", "email", "upn", "unique_name")
                    .map(decoded::getClaim)
                    .filter(Objects::nonNull)
                    .map(claim -> claim.asString())
                    .filter(valor -> valor != null && !valor.isBlank())
                    .findFirst()
                    .orElse(null);

            String id = decoded.getSubject();
            if (id == null || id.isBlank()) {
                id = decoded.getClaim("oid").asString();
            }

            if (email == null || id == null || email.isBlank() || id.isBlank()) {
                return null;
            }

            return Map.of(
                    "email", email,
                    "id", id
            );
        } catch (JWTDecodeException e) {
            return null;
        }
    }


//    public List<Usuario> getUsuariosPorRol(Long idrol) {
//        return usuarioRepository.findByRol_IdRol(idrol);
//    }

    public List<Usuario> getUsuariosPorRol(Long idrol) {
        List<Usuario> usuarios = usuarioRepository.findByRoles_IdRol(idrol);
        usuarios.forEach(u -> u.getRoles().removeIf(r -> !r.getIdRol().equals(idrol)));
        return usuarios;
    }


    public Usuario actualizarUsuario(Usuario usuario) {
        // Buscar el usuario existente por su id
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuario.getIdUsuario());
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        Usuario usuarioExistente = usuarioOpt.get();

        // Actualizar los campos simples
        usuarioExistente.setNombreUsuario(usuario.getNombreUsuario());
        usuarioExistente.setApellidoPaterno(usuario.getApellidoPaterno());
        usuarioExistente.setApellidoMaterno(usuario.getApellidoMaterno());
        usuarioExistente.setEmail(usuario.getEmail());
        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        usuarioExistente.setTelefono(usuario.getTelefono());
        usuarioExistente.setCell(usuario.getCell());
        usuarioExistente.setDireccion(usuario.getDireccion());
        usuarioExistente.setNumDocumento(usuario.getNumDocumento());
        if (usuario.getTipodocumento() != null && usuario.getTipodocumento().getIdTipoDocumento() != null) {
            TipoDocumento tipo = tipoDocumentoRepository.findById(usuario.getTipodocumento().getIdTipoDocumento())
                    .orElseThrow(() -> new RuntimeException("Tipo de documento no encontrado"));
            usuarioExistente.setTipodocumento(tipo);
        }
        // Se omite la actualización de roles aquí, pues se maneja en endpoints específicos

        return usuarioRepository.save(usuarioExistente);
    }

    // Devuelve el rol asignado al usuario (en este ejemplo, solo uno)
    public List<Rol> getRolesAsignados(Long idusuario) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idusuario);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Retornamos la lista de roles asignados (si no hay ninguno, retorna lista vacía)
            return List.copyOf(usuario.getRoles());
        }
        throw new RuntimeException("Usuario no encontrado");
    }

    // Devuelve la lista de roles que no están asignados al usuario
    public List<Rol> getRolesNoAsignados(Long idusuario) {
        List<Rol> allRoles = rolRepository.findAll();
        List<Rol> rolesAsignados = getRolesAsignados(idusuario);
        // Filtramos los roles que ya están asignados
        allRoles.removeAll(rolesAsignados);
        return allRoles;
    }

    public void agregarRolUsuario(Long idusuario, Long idrol) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idusuario);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        Usuario usuario = usuarioOpt.get();

        Optional<Rol> rolOpt = rolRepository.findById(idrol);
        if (rolOpt.isEmpty()) {
            throw new RuntimeException("Rol no encontrado");
        }
        Rol rol = rolOpt.get();

        // Solo se agrega si no está asignado
        if (!usuario.getRoles().contains(rol)) {
            usuario.getRoles().add(rol);
            usuarioRepository.save(usuario);
        }
    }

    public void quitarRolUsuario(Long idusuario, Long idrol) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idusuario);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        Usuario usuario = usuarioOpt.get();

        Optional<Rol> rolOpt = rolRepository.findById(idrol);
        if (rolOpt.isEmpty()) {
            throw new RuntimeException("Rol no encontrado");
        }
        Rol rol = rolOpt.get();

        // Solo se quita si está asignado
        if (usuario.getRoles().contains(rol)) {
            usuario.getRoles().remove(rol);
            usuarioRepository.save(usuario);
        }
    }

    // Método para eliminar un usuario por su ID
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario cambiarEstadoUsuario(Long id, String estado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // Validar que el estado sea uno de los permitidos
        if ("ACTIVO".equalsIgnoreCase(estado) || "DESACTIVADO".equalsIgnoreCase(estado)) {
            usuario.setIdEstado(estado.toUpperCase());
        } else {
            throw new RuntimeException("Estado no válido. Solo se permiten 'ACTIVO' o 'DESACTIVADO'");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario registrar(Usuario usuario) {
        // Aquí se puede agregar cualquier lógica adicional, por ejemplo, encriptar la contraseña, validar datos, etc.
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listar(String q) {
        return listar(q, null, null);
    }

    public List<Usuario> listar(String q, Long idRol) {
        return listar(q, idRol, null);
    }

    public List<Usuario> listar(String q, Long idRol, Integer tipo) {
        List<Usuario> base;
        if (idRol != null) {
            base = usuarioRepository.findByRoles_IdRol(idRol);
            base.forEach(u -> u.getRoles().removeIf(r -> !r.getIdRol().equals(idRol)));
        } else {
            base = usuarioRepository.findAll();
        }

        if (q == null || q.isBlank()) {
            return base;
        }

        String qLower = q.toLowerCase();
        List<Usuario> filtrados = new ArrayList<>();

        for (Usuario u : base) {
            boolean matches = false;
            if (tipo == null) {
                String login = u.getLogin() != null ? u.getLogin().toLowerCase() : "";
                String email = u.getEmail() != null ? u.getEmail().toLowerCase() : "";
                String numDoc = u.getNumDocumento() != null ? u.getNumDocumento().toString() : "";
                String nombres = u.getNombreUsuario() != null ? u.getNombreUsuario() : "";
                String apPat = u.getApellidoPaterno() != null ? u.getApellidoPaterno() : "";
                String apMat = u.getApellidoMaterno() != null ? u.getApellidoMaterno() : "";
                String nombreCompleto = (nombres + " " + apPat + " " + apMat).toLowerCase();
                matches = login.contains(qLower) || email.contains(qLower) || numDoc.contains(q) || nombreCompleto.contains(qLower);
            } else if (tipo == 1) {
                String numDoc = u.getNumDocumento() != null ? u.getNumDocumento().toString() : "";
                matches = numDoc.contains(q);
            } else if (tipo == 2) {
                String nombres = u.getNombreUsuario() != null ? u.getNombreUsuario() : "";
                String apPat = u.getApellidoPaterno() != null ? u.getApellidoPaterno() : "";
                String apMat = u.getApellidoMaterno() != null ? u.getApellidoMaterno() : "";
                String nombreCompleto = (nombres + " " + apPat + " " + apMat).toLowerCase();
                matches = nombreCompleto.contains(qLower);
            } else if (tipo == 3) {
                String login = u.getLogin() != null ? u.getLogin().toLowerCase() : "";
                String email = u.getEmail() != null ? u.getEmail().toLowerCase() : "";
                matches = login.contains(qLower) || email.contains(qLower);
            }

            if (matches) {
                filtrados.add(u);
            }
        }

        return filtrados;
    }
    /** Incrementa el contador de logeos del usuario. */
    public void incrementarContadorLogins(String login) {
        usuarioRepository.findByLoginIgnoreCase(login).ifPresent(u -> {
            long count = u.getLoginCount() == null ? 0L : u.getLoginCount();
            u.setLoginCount(count + 1);
            usuarioRepository.save(u);
        });
    }
    private void asignarDetalleAcademico(Usuario usuario, IntegracionPersonaDetalleDTO detalle) {
        String programa = seleccionarValorPreferido(detalle.getDescCarrera(), detalle.getCarrera());
        String campus = seleccionarValorPreferido(detalle.getDescCampus(), detalle.getCampus());
        usuario.setProgram(programa);
        usuario.setCampus(campus);
    }

    private String construirNombreCompleto(String nombre, String apellidoPaterno, String apellidoMaterno) {
        return Stream.of(nombre, apellidoPaterno, apellidoMaterno)
                .filter(valor -> valor != null && !valor.isBlank())
                .collect(Collectors.joining(" "))
                .trim();
    }

    private String seleccionarValorPreferido(String preferido, String alterno) {
        if (preferido != null && !preferido.isBlank()) {
            return preferido;
        }
        return alterno;
    }
}
