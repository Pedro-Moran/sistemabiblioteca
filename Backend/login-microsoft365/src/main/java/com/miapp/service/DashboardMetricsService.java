package com.miapp.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.miapp.model.Biblioteca;
import com.miapp.model.dto.DashboardIncomeDTO;
import com.miapp.model.dto.DashboardRecursoDTO;
import com.miapp.model.dto.DashboardStatsDTO;
import com.miapp.repository.BibliotecaRepository;
import com.miapp.repository.DetalleBibliotecaRepository;
import com.miapp.repository.DetallePrestamoRepository;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.UsuarioRepository;

@Service
public class DashboardMetricsService {

    private static final Locale LOCALE_ES = new Locale("es", "PE");
    private static final DateTimeFormatter LABEL_FORMATTER = DateTimeFormatter.ofPattern("MMM yyyy", LOCALE_ES);

    private final BibliotecaRepository bibliotecaRepository;
    private final DetalleBibliotecaRepository detalleBibliotecaRepository;
    private final EquipoRepository equipoRepository;
    private final DetallePrestamoRepository detallePrestamoRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardMetricsService(
            BibliotecaRepository bibliotecaRepository,
            DetalleBibliotecaRepository detalleBibliotecaRepository,
            EquipoRepository equipoRepository,
            DetallePrestamoRepository detallePrestamoRepository,
            UsuarioRepository usuarioRepository) {
        this.bibliotecaRepository = bibliotecaRepository;
        this.detalleBibliotecaRepository = detalleBibliotecaRepository;
        this.equipoRepository = equipoRepository;
        this.detallePrestamoRepository = detallePrestamoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO obtenerEstadisticas() {
        long totalMateriales = bibliotecaRepository.count();
        long prestadosMateriales = detalleBibliotecaRepository.countByFechaPrestamoIsNotNullAndFechaFinIsNull();
        long totalEquipos = equipoRepository.count();
        long prestadosEquipos = detallePrestamoRepository.countByFechaPrestamoIsNotNullAndFechaRecepcionIsNull();
        long totalUsuarios = usuarioRepository.count();
        long usuariosActivos = usuarioRepository.countByIdEstadoIgnoreCase("ACTIVO");

        return new DashboardStatsDTO(
                totalMateriales,
                prestadosMateriales,
                totalEquipos,
                prestadosEquipos,
                totalUsuarios,
                usuariosActivos,
                0,
                0);
    }

    @Transactional(readOnly = true)
    public DashboardIncomeDTO obtenerIngresosMensuales(int meses) {
        int totalMeses = Math.max(meses, 1);

        List<String> labels = new ArrayList<>(totalMeses);
        List<Long> biblioteca = new ArrayList<>(totalMeses);
        List<Long> computo = new ArrayList<>(totalMeses);

        LocalDate mesReferencia = LocalDate.now().withDayOfMonth(1);

        for (int offset = totalMeses - 1; offset >= 0; offset--) {
            LocalDate mes = mesReferencia.minusMonths(offset);
            LocalDateTime inicio = mes.atStartOfDay();
            LocalDateTime fin = mes.plusMonths(1).atStartOfDay();

            labels.add(mes.format(LABEL_FORMATTER));
            biblioteca.add(detalleBibliotecaRepository.countByFechaPrestamoBetween(inicio, fin));
            computo.add(detallePrestamoRepository.countByFechaPrestamoBetween(inicio, fin));
        }

        return new DashboardIncomeDTO(labels, biblioteca, computo);
    }

    @Transactional(readOnly = true)
    public List<DashboardRecursoDTO> obtenerRecursosRecientes(int limite) {
        int cantidad = Math.max(limite, 1);
        List<Biblioteca> recientes = bibliotecaRepository
                .findAll(PageRequest.of(0, cantidad, Sort.by(Sort.Direction.DESC, "fechaCreacion")))
                .getContent();

        List<DashboardRecursoDTO> recursos = new ArrayList<>(recientes.size());
        for (Biblioteca biblioteca : recientes) {
            recursos.add(new DashboardRecursoDTO(
                    biblioteca.getId(),
                    Optional.ofNullable(biblioteca.getTitulo()).orElse("Sin título"),
                    Optional.ofNullable(biblioteca.getCosto()).orElse(BigDecimal.ZERO),
                    construirImagen(biblioteca)));
        }
        return recursos;
    }

    private String construirImagen(Biblioteca biblioteca) {
        String ruta = Optional.ofNullable(biblioteca.getRutaImagen()).orElse("").trim();
        String nombre = Optional.ofNullable(biblioteca.getNombreImagen()).orElse("").trim();

        if (ruta.isEmpty() && nombre.isEmpty()) {
            return "";
        }

        String separador = ruta.endsWith("/") || ruta.isEmpty() || nombre.isEmpty() ? "" : "/";
        return (ruta + separador + nombre).replace("//", "/");
    }
}