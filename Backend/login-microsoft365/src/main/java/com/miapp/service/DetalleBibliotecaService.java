package com.miapp.service;


import com.miapp.mapper.BibliotecaMapper;
import com.miapp.model.DetalleBiblioteca;
import com.miapp.model.Usuario;
import com.miapp.model.dto.CambioEstadoDetalleRequest;
import com.miapp.model.dto.DetalleBibliotecaDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.repository.DetalleBibliotecaRepository;
import com.miapp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.AbstractMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DetalleBibliotecaService {

    private final DetalleBibliotecaRepository detalleBibliotecaRepository;
    private final BibliotecaMapper mapper;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ResponseDTO cambiarEstado(CambioEstadoDetalleRequest req) {
        return detalleBibliotecaRepository.findById(req.getIdDetalleBiblioteca())
                .map(det -> {
                    det.setIdEstado(req.getIdEstado());
                    if (req.getTipoPrestamo() != null) {
                        det.setTipoPrestamo(req.getTipoPrestamo());
                    }
                    det.setUsuarioModificacion(req.getIdUsuario());
                    detalleBibliotecaRepository.save(det);
                    return new ResponseDTO(0, "Estado de detalle actualizado",null);
                })
                .orElseGet(() -> new ResponseDTO(1, "Detalle no encontrado",null));
    }

    public List<DetalleBibliotecaDTO> findDetallesReservados(Long sedeId, String tipoPrestamo) {
        List<DetalleBiblioteca> lista = detalleBibliotecaRepository.findByIdEstado(3L);

        return lista.stream()
                .map(detalle -> new AbstractMap.SimpleEntry<>(
                        detalle,
                        usuarioRepository.findByLoginIgnoreCase(detalle.getCodigoUsuario())
                ))
                .filter(entry -> {
                    DetalleBiblioteca det = entry.getKey();
                    Optional<Usuario> userOpt = entry.getValue();

                    if (sedeId != null) {
                        if (userOpt.isEmpty() || userOpt.get().getIdSede() == null || !userOpt.get().getIdSede().equals(sedeId)) {
                            return false;
                        }
                    }

                    if (tipoPrestamo != null) {
                        String detalleTipo = normalizeTipoPrestamo(det.getTipoPrestamo());
                        String filtroTipo = normalizeTipoPrestamo(tipoPrestamo);
                        if (detalleTipo == null || !detalleTipo.equalsIgnoreCase(filtroTipo)) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(entry -> {
                    DetalleBiblioteca det = entry.getKey();
                    Optional<Usuario> userOpt = entry.getValue();
                    DetalleBibliotecaDTO dto = mapper.toDetalleDto(det);
                    userOpt.ifPresent(u -> {
                        String nombres = String.format("%s %s %s",
                                u.getApellidoPaterno() != null ? u.getApellidoPaterno() : "",
                                u.getApellidoMaterno() != null ? u.getApellidoMaterno() : "",
                                u.getNombreUsuario() != null ? u.getNombreUsuario() : "").trim();
                        dto.setNombreUsuario(nombres);
                        dto.setDocumentoUsuario(u.getNumDocumento() != null ? String.valueOf(u.getNumDocumento()) : null);
                        dto.setCorreoUsuario(u.getEmail());
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private String normalizeTipoPrestamo(String tipo) {
        if (tipo == null) {
            return null;
        }

        // Normalizamos el texto para evitar discrepancias por espacios o mayúsculas
        String normalized = tipo.trim().toUpperCase().replace(' ', '_');

        return switch (normalized) {
            case "PRESTAMO_EN_SALA", "EN_SALA" -> "PRESTAMO_EN_SALA";
            case "PRESTAMO_A_DOMICILIO", "A_DOMICILIO" -> "PRESTAMO_A_DOMICILIO";
            case "PRESTAMO_SALA_DOMICILIO", "EN_SALA_DOMICILIO", "SALAYDOMICILIO", "SALA_Y_DOMICILIO" -> "PRESTAMO_SALA_DOMICILIO";
            default -> normalized;
        };
    }

    /**
     * Devuelve los detalles prestados filtrando opcionalmente por sede, usuario y otros criterios.
     */
    public List<DetalleBibliotecaDTO> findDetallesPrestados(
            String fechaInicio,
            String fechaFin,
            Long sedeId,
            Long tipoUsuarioId,
            String tipoPrestamo,
            Long especialidadId,
            Long programaId,
            String ciclo) {

        LocalDateTime inicio = null;
        LocalDateTime fin    = null;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            if (fechaInicio != null && !fechaInicio.isBlank()) {
                inicio = LocalDate.parse(fechaInicio, fmt).atStartOfDay();
            }
            if (fechaFin != null && !fechaFin.isBlank()) {
                fin = LocalDate.parse(fechaFin, fmt).atTime(LocalTime.MAX);
            }
        } catch (Exception ignored) {
        }

        String tipoNormalizado = normalizeTipoPrestamo(tipoPrestamo);

        return detalleBibliotecaRepository.findPrestadosBetween(inicio, fin).stream()
                // Filtra por sede del detalle
                .filter(det -> sedeId == null || (det.getSede() != null && sedeId.equals(det.getSede().getId())))
                // Filtra por tipo de préstamo si corresponde
                .filter(det -> tipoNormalizado == null ||
                        tipoNormalizado.equalsIgnoreCase(normalizeTipoPrestamo(det.getTipoPrestamo())))
                // Filtra por especialidad de la cabecera Biblioteca
                .filter(det -> especialidadId == null ||
                        (det.getBiblioteca() != null && det.getBiblioteca().getEspecialidad() != null &&
                                especialidadId.equals(det.getBiblioteca().getEspecialidad().getIdEspecialidad())))
                // Asocia usuario para aplicar filtros adicionales
                .map(det -> new AbstractMap.SimpleEntry<>(det,
                        usuarioRepository.findByLoginIgnoreCase(det.getCodigoUsuario())))
                .filter(entry -> {
                    Usuario u = entry.getValue().orElse(null);
                    if (tipoUsuarioId != null) {
                        if (u == null || u.getRoles().stream().noneMatch(r -> r.getIdRol().equals(tipoUsuarioId))) {
                            return false;
                        }
                    }
                    if (programaId != null) {
                        if (u == null || u.getPrograma() == null ||
                                !u.getPrograma().getIdPrograma().equals(programaId)) {
                            return false;
                        }
                    }
                    if (ciclo != null && !ciclo.isBlank()) {
                        if (u == null || u.getCiclo() == null || !u.getCiclo().equalsIgnoreCase(ciclo)) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(entry -> mapper.toDetalleDto(entry.getKey()))
                .collect(Collectors.toList());
    }

    /** Obtiene un detalle por ID y lo mapea a DTO */
    public DetalleBibliotecaDTO findById(Long id) {
        return detalleBibliotecaRepository.findById(id)
                .map(mapper::toDetalleDto)
                .orElse(null);
    }

    /** Obtiene un detalle por número de ingreso y lo mapea a DTO */
    public DetalleBibliotecaDTO findByNumeroIngreso(Long numeroIngreso) {
        return detalleBibliotecaRepository.findFirstByNumeroIngreso(numeroIngreso)
                .map(mapper::toDetalleDto)
                .orElse(null);
    }
}