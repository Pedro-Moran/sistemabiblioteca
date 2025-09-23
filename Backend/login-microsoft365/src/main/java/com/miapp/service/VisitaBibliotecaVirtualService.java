package com.miapp.service;

import com.miapp.model.Usuario;
import com.miapp.model.VisitaBibliotecaVirtual;
import com.miapp.model.VisitaBibliotecaVirtualEstado;
import com.miapp.repository.UsuarioRepository;
import com.miapp.repository.VisitaBibliotecaVirtualRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitaBibliotecaVirtualService {

    private static final int CODIGO_MAX_LENGTH = 10;
    private static final Pattern NO_ALFANUMERICO = Pattern.compile("[^A-Za-z0-9]");
    private static final Pattern NO_DIGITO = Pattern.compile("\\D");
    private static final Pattern SOLO_ALFANUMERICO = Pattern.compile("^[A-Z0-9]+$");

    private final VisitaBibliotecaVirtualRepository repository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Registra un evento de visita usando el código indicado. Normaliza el identificador, asegura un id consecutivo
     * y marca la hora correspondiente según el estado recibido.
     */
    @Transactional
    public VisitaBibliotecaVirtual registrar(String codigoUsuario, Integer estado) {
        String codigoNormalizado = normalizarCodigo(codigoUsuario);
        if (codigoNormalizado == null) {
            throw new IllegalArgumentException("El código de usuario es obligatorio para registrar la visita");
        }

        LocalDateTime ahora = LocalDateTime.now();
        VisitaBibliotecaVirtual visita = new VisitaBibliotecaVirtual();
        visita.setId(obtenerSiguienteId());
        visita.setCodigoUsuario(codigoNormalizado);
        int estadoNormalizado = estado != null ? estado : VisitaBibliotecaVirtualEstado.INGRESO_PRESENCIAL;
        visita.setEstado(estadoNormalizado);
        visita.setFechaRegistro(ahora);
        if (VisitaBibliotecaVirtualEstado.esIngreso(estadoNormalizado)) {
            visita.setHoraIngreso(ahora);
            visita.setHoraSalida(null);
        } else {
            visita.setHoraSalida(ahora);
        }
        return repository.saveAndFlush(visita);
    }

    /**
     * Registra automáticamente un ingreso utilizando los datos disponibles del usuario.
     */
    public Optional<VisitaBibliotecaVirtual> registrarIngresoAutomatico(Usuario usuario) {
        if (usuario == null) {
            return Optional.empty();
        }

        String codigoPreferido = obtenerCodigoPreferido(usuario);
        if (codigoPreferido == null) {
            log.warn("No se pudo registrar la visita virtual: el usuario {} no tiene identificadores válidos", usuario.getIdUsuario());
            return Optional.empty();
        }

        try {
            return Optional.of(registrar(codigoPreferido, VisitaBibliotecaVirtualEstado.INGRESO_VIRTUAL));
        } catch (Exception ex) {
            log.warn("No se pudo registrar la visita virtual para el código {}: {}", codigoPreferido, ex.getMessage());
            log.debug("Detalle del error al registrar visita virtual", ex);
            return Optional.empty();
        }
    }

    private long obtenerSiguienteId() {
        Long maxId = repository.findMaxId();
        return (maxId != null ? maxId : 0L) + 1L;
    }

    private String obtenerCodigoPreferido(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        Usuario persistido = cargarUsuarioPersistido(usuario);
        String codigoEmplid = resolverCodigoEmplid(usuario, persistido);
        if (codigoEmplid != null) {
            return codigoEmplid;
        }

        return resolverCodigoAlternativo(usuario, persistido);
    }

    private String resolverCodigoEmplid(Usuario principal, Usuario alterno) {
        Set<String> candidatos = new LinkedHashSet<>();
        agregarEmplidCandidato(candidatos, principal);
        agregarEmplidCandidato(candidatos, alterno);

        for (String candidato : candidatos) {
            String normalizado = normalizarCodigo(candidato);
            if (normalizado != null) {
                return normalizado;
            }
        }

        return null;
    }

    private void agregarEmplidCandidato(Set<String> candidatos, Usuario usuario) {
        if (usuario == null) {
            return;
        }

        registrarVariantes(candidatos, usuario.getEmplid());
    }

    private Usuario cargarUsuarioPersistido(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        if (usuario.getIdUsuario() != null) {
            Optional<Usuario> porId = usuarioRepository.findById(usuario.getIdUsuario());
            if (porId.isPresent()) {
                return porId.get();
            }
        }

        if (tieneTexto(usuario.getEmail())) {
            Optional<Usuario> porEmail = usuarioRepository.findByEmailIgnoreCase(usuario.getEmail());
            if (porEmail.isPresent()) {
                return porEmail.get();
            }
        }

        if (tieneTexto(usuario.getEmailInst())) {
            Optional<Usuario> porEmailInst = usuarioRepository.findByEmailInstIgnoreCase(usuario.getEmailInst());
            if (porEmailInst.isPresent()) {
                return porEmailInst.get();
            }
        }

        if (tieneTexto(usuario.getLogin())) {
            Optional<Usuario> porLogin = usuarioRepository.findByLoginIgnoreCase(usuario.getLogin());
            if (porLogin.isPresent()) {
                return porLogin.get();
            }
        }

        if (tieneTexto(usuario.getEmailPersonal())) {
            Optional<Usuario> porEmailPersonal = usuarioRepository.findByEmailPersonalIgnoreCase(usuario.getEmailPersonal());
            if (porEmailPersonal.isPresent()) {
                return porEmailPersonal.get();
            }
        }

        if (tieneTexto(usuario.getEmplid())) {
            Optional<Usuario> porEmplid = usuarioRepository.findByEmplid(usuario.getEmplid().trim());
            if (porEmplid.isPresent()) {
                return porEmplid.get();
            }
        }

        return null;
    }

    private boolean tieneTexto(String valor) {
        return valor != null && !valor.trim().isEmpty();
    }

    private String resolverCodigoAlternativo(Usuario principal, Usuario alterno) {
        Set<String> candidatos = new LinkedHashSet<>();
        registrarCandidatosBasicos(candidatos, principal);
        registrarCandidatosBasicos(candidatos, alterno);

        for (String candidato : candidatos) {
            String normalizado = normalizarCodigo(candidato);
            if (normalizado != null) {
                return normalizado;
            }
        }

        return null;
    }

    private void registrarCandidatosBasicos(Set<String> candidatos, Usuario usuario) {
        if (usuario == null) {
            return;
        }

        agregarCandidato(candidatos, usuario.getNumDocumento() != null ? usuario.getNumDocumento().toString() : null);
        agregarCandidato(candidatos, usuario.getLogin());
        agregarCandidato(candidatos, usuario.getEmail());
        agregarCandidato(candidatos, usuario.getEmailInst());
        agregarCandidato(candidatos, usuario.getEmailPersonal());
        agregarCandidato(candidatos, usuario.getNationalId());
        agregarCandidato(candidatos, usuario.getCell());
        agregarCandidato(candidatos, usuario.getPhone());
        agregarCandidato(candidatos, usuario.getIdUsuario() != null ? usuario.getIdUsuario().toString() : null);
    }

    private void agregarCandidato(Set<String> candidatos, String valor) {
        if (valor == null) {
            return;
        }

        String trimmed = valor.trim();
        if (trimmed.isEmpty()) {
            return;
        }

        registrarVariantes(candidatos, trimmed);

        int atIndex = trimmed.indexOf('@');
        if (atIndex > 0) {
            String localPart = trimmed.substring(0, atIndex);
            registrarVariantes(candidatos, localPart);
        }

        String sinSeparadores = NO_ALFANUMERICO.matcher(trimmed).replaceAll("");
        registrarVariantes(candidatos, sinSeparadores);

        String soloDigitos = NO_DIGITO.matcher(trimmed).replaceAll("");
        registrarVariantes(candidatos, soloDigitos);

        if (atIndex > 0) {
            String localPart = trimmed.substring(0, atIndex);
            String localSinSeparadores = NO_ALFANUMERICO.matcher(localPart).replaceAll("");
            registrarVariantes(candidatos, localSinSeparadores);

            String localSoloDigitos = NO_DIGITO.matcher(localPart).replaceAll("");
            registrarVariantes(candidatos, localSoloDigitos);
        }
    }

    private void registrarVariantes(Set<String> candidatos, String valor) {
        if (valor == null) {
            return;
        }

        String trimmed = valor.trim();
        if (trimmed.isEmpty()) {
            return;
        }

        candidatos.add(trimmed);

        if (trimmed.length() > CODIGO_MAX_LENGTH) {
            candidatos.add(trimmed.substring(0, CODIGO_MAX_LENGTH));
            candidatos.add(trimmed.substring(trimmed.length() - CODIGO_MAX_LENGTH));
        }
    }

    private String normalizarCodigo(String codigoUsuario) {
        if (codigoUsuario == null) {
            return null;
        }
        String trimmed = codigoUsuario.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        String upper = trimmed.toUpperCase(Locale.ROOT);
        if (upper.length() > CODIGO_MAX_LENGTH) {
            log.debug("Descartando identificador {} porque excede el máximo de {} caracteres para visitas virtuales",
                    upper,
                    CODIGO_MAX_LENGTH);
            return null;
        }
        if (!SOLO_ALFANUMERICO.matcher(upper).matches()) {
            log.debug("Descartando identificador {} porque contiene caracteres no alfanuméricos", upper);
            return null;
        }
        return upper;
    }
}