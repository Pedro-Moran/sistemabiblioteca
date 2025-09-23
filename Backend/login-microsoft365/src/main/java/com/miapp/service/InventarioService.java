package com.miapp.service;

import com.miapp.model.Biblioteca;
import com.miapp.model.DetalleBiblioteca;
import com.miapp.model.dto.ActualizarInventarioRequest;
import com.miapp.model.dto.InventarioItemDTO;
import com.miapp.model.enums.EstadoInventario;
import com.miapp.repository.DetalleBibliotecaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class InventarioService {

    private final DetalleBibliotecaRepository detalleRepository;

    public InventarioService(DetalleBibliotecaRepository detalleRepository) {
        this.detalleRepository = detalleRepository;
    }

    @Transactional(readOnly = true)
    public List<InventarioItemDTO> buscarMateriales(String termino) {
        if (!StringUtils.hasText(termino)) {
            return List.of();
        }
        String filtro = termino.trim();
        LinkedHashMap<Long, DetalleBiblioteca> encontrados = new LinkedHashMap<>();

        detalleRepository
                .findTop20ByCodigoBarraContainingIgnoreCaseOrderByIdDetalleAsc(filtro)
                .forEach(det -> encontrados.put(det.getIdDetalle(), det));

        detalleRepository
                .findTop20ByBiblioteca_CodigoLocalizacionContainingIgnoreCaseOrderByIdDetalleAsc(filtro)
                .forEach(det -> encontrados.putIfAbsent(det.getIdDetalle(), det));

        if (encontrados.isEmpty()) {
            try {
                Long numeroIngreso = Long.parseLong(filtro);
                detalleRepository
                        .findFirstByNumeroIngreso(numeroIngreso)
                        .ifPresent(det -> encontrados.putIfAbsent(det.getIdDetalle(), det));
            } catch (NumberFormatException ignored) {
                // El código no corresponde a un número, se ignora el filtro por número de ingreso
            }
        }

        return encontrados
                .values()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public InventarioItemDTO actualizarEstado(ActualizarInventarioRequest request, String usuario) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solicitud inválida");
        }

        EstadoInventario estado = EstadoInventario.from(request.getEstadoInventario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de inventario no permitido"));

        DetalleBiblioteca detalle = localizarDetalle(request)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró el ejemplar solicitado"));

        String usuarioFinal = StringUtils.hasText(usuario) ? usuario : "sistema";
        detalle.setEstadoInventario(estado.name());
        detalle.setUsuarioVerificacion(usuarioFinal);
        detalle.setFechaVerificacion(LocalDateTime.now());
        detalle.setUsuarioModificacion(usuarioFinal);
        detalle.setFechaModificacion(LocalDateTime.now());

        detalleRepository.save(detalle);

        return toDto(detalle);
    }

    private Optional<DetalleBiblioteca> localizarDetalle(ActualizarInventarioRequest request) {
        Long id = request.resolveDetalleId();
        if (id != null) {
            return detalleRepository.findWithBibliotecaById(id);
        }
        if (StringUtils.hasText(request.getCodigoBarra())) {
            return detalleRepository.findFirstByCodigoBarra(request.getCodigoBarra().trim());
        }
        if (StringUtils.hasText(request.getCodigoLocalizacion())) {
            return detalleRepository
                    .findTop20ByBiblioteca_CodigoLocalizacionContainingIgnoreCaseOrderByIdDetalleAsc(
                            request.getCodigoLocalizacion().trim())
                    .stream()
                    .findFirst();
        }
        return Optional.empty();
    }

    private InventarioItemDTO toDto(DetalleBiblioteca detalle) {
        Biblioteca biblioteca = detalle.getBiblioteca();
        String codigoLocalizacion = biblioteca != null ? biblioteca.getCodigoLocalizacion() : null;
        String titulo = biblioteca != null ? biblioteca.getTitulo() : null;
        String autor = biblioteca != null ? construirAutor(biblioteca) : null;

        String estado = Optional.ofNullable(detalle.getEstadoInventario())
                .filter(StringUtils::hasText)
                .map(valor -> valor.trim().toUpperCase(Locale.ROOT))
                .orElse(EstadoInventario.PENDIENTE.name());

        return new InventarioItemDTO(
                detalle.getIdDetalle(),
                detalle.getIdDetalle(),
                detalle.getCodigoBarra(),
                codigoLocalizacion,
                titulo,
                autor,
                estado,
                detalle.getFechaVerificacion(),
                detalle.getUsuarioVerificacion()
        );
    }

    private String construirAutor(Biblioteca biblioteca) {
        return Stream.of(
                        biblioteca.getAutorPersonal(),
                        biblioteca.getAutorInstitucional(),
                        biblioteca.getAutorSecundario(),
                        biblioteca.getDirector(),
                        biblioteca.getCompilador(),
                        biblioteca.getCoordinador(),
                        biblioteca.getProductor())
                .filter(StringUtils::hasText)
                .map(String::trim)
                .distinct()
                .collect(Collectors.joining(" / "));
    }
}