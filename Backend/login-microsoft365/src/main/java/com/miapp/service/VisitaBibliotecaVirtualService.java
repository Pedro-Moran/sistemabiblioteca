package com.miapp.service;

import com.miapp.model.Usuario;
import com.miapp.model.VisitaBibliotecaVirtual;
import com.miapp.repository.VisitaBibliotecaVirtualRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitaBibliotecaVirtualService {

    private static final int CODIGO_MAX_LENGTH = 10;

    private final VisitaBibliotecaVirtualRepository repository;

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
        visita.setEstado(estado != null ? estado : 1);
        visita.setFechaRegistro(ahora);
        if (estado == null || estado == 1) {
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

        String codigoPreferido = resolverCodigoPreferido(usuario);
        if (codigoPreferido == null) {
            log.warn("No se pudo registrar la visita virtual: el usuario {} no tiene identificadores válidos", usuario.getIdUsuario());
            return Optional.empty();
        }

        try {
            return Optional.of(registrar(codigoPreferido, 1));
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

    private String resolverCodigoPreferido(Usuario usuario) {
        String documento = usuario.getNumDocumento() != null
                ? usuario.getNumDocumento().toString()
                : null;

        String[] candidatos = {
                usuario.getEmplid(),
                documento,
                usuario.getLogin(),
                usuario.getEmail(),
                usuario.getEmailInst(),
                usuario.getEmailPersonal(),
                usuario.getNationalId(),
                usuario.getCell(),
                usuario.getPhone()
        };

        for (String candidato : candidatos) {
            String normalizado = normalizarCodigo(candidato);
            if (normalizado != null) {
                return normalizado;
            }
        }

        return null;
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
        return upper;
    }
}
