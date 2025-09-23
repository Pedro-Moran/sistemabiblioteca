package com.miapp.service;

import com.miapp.model.*;
import com.miapp.model.dto.DetalleBibliotecaDTO;
import com.miapp.mapper.BibliotecaMapper;
import com.miapp.repository.DetallePrestamoRepository;
import com.miapp.repository.DetalleBibliotecaRepository;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.EstadoRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.repository.UsuarioRepository;
import com.miapp.repository.VisitaBibliotecaVirtualRepository;
import com.miapp.spec.DetallePrestamoSpecs;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import com.miapp.model.dto.IntranetVisitaDTO;
import com.miapp.model.dto.VisitanteBibliotecaVirtualDTO;
import com.miapp.model.dto.VisitantesPorDiaDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.stream.Collectors;

import static com.miapp.spec.DetallePrestamoSpecs.conFetchEquipoYSede;

@Service
@RequiredArgsConstructor
@Transactional
public class PrestamoService {

    private final EquipoRepository equipoRepository;
    private final DetallePrestamoRepository detallePrestamoRepository;
    private final EstadoRepository estadoRepository;
    private final NotificacionService notificacionService;
    private final SedeService sedeService;
    private final EmailService emailService;
    private final TaskScheduler scheduler;
    private final OcurrenciaBibliotecaRepository ocurrenciaBibliotecaRepository;
    private final UsuarioRepository usuarioRepository;
    private final DetalleBibliotecaRepository detalleBibliotecaRepository;
    private final VisitaBibliotecaVirtualRepository visitaBibliotecaVirtualRepository;
    private final BibliotecaMapper bibliotecaMapper;
    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final ProgramaMotivoAccionService programaMotivoAccionService;

    public DetallePrestamo solicitarPrestamo(Long equipoId,
                                             Integer tipoUsuario,
                                             String codigoUsuario,
                                             String codigoSede,
                                             String codigoSemestre,
                                             String codigoPrograma,
                                             String codigoEscuela,
                                             String codigoTurno,
                                             String codigoCiclo,
                                             TipoPrestamo tipoPrestamo,
                                             LocalDateTime fechaInicio,
                                             LocalDateTime fechaFin,
                                             String usuarioLogueado,
                                             String estadoPrograma,
                                             String motaccion) {
        programaMotivoAccionService.validarReservaPermitida(estadoPrograma, motaccion);
        Equipo eq = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        // 1) Estado “RESERVADO”
        Estado reservado = estadoRepository
                .findByDescripcionIgnoreCase("RESERVADO")
                .orElseThrow(() -> new RuntimeException("Estado ‘RESERVADO’ no existe"));
        eq.setEstado(reservado);
        equipoRepository.save(eq);

        DetallePrestamo dp = new DetallePrestamo();
        dp.setEquipo(eq);
        dp.setTipoUsuario(tipoUsuario);
        dp.setCodigoUsuario(codigoUsuario);
        dp.setCodigoSede(codigoSede);
        dp.setCodigoSemestre(codigoSemestre);
        dp.setCodigoPrograma(codigoPrograma);
        dp.setCodigoEscuela(codigoEscuela);
        dp.setCodigoTurno(codigoTurno);
        dp.setCodigoCiclo(codigoCiclo);
        dp.setTipoPrestamo(tipoPrestamo);
        dp.setEstado(reservado);
        dp.setFechaSolicitud(LocalDateTime.now());
        dp.setFechaInicio(fechaInicio);
        dp.setFechaFin(fechaFin);
        dp.setUsuarioPrestamo(usuarioLogueado);
        dp = detallePrestamoRepository.save(dp);

        return dp;
    }

    private void scheduleReminder(DetallePrestamo dp, long amount, ChronoUnit unit) {
        LocalDateTime when = dp.getFechaFin().minus(amount, unit);
        if (when.isAfter(LocalDateTime.now())) {
            scheduler.schedule(() -> {
                // aquí disparas tu recordatorio real
                emailService.sendReturnReminder(dp, amount, unit);
                DetallePrestamo fresh = detallePrestamoRepository
                        .findById(dp.getId())
                        .orElseThrow();
                // marca en BD si quieres (solo prueba)
                detallePrestamoRepository.save(fresh);
            }, Date.from(when.atZone(ZoneId.systemDefault()).toInstant()));
        }
    }

    public DetallePrestamo procesarPrestamo(Long prestamoId, boolean aprobar, String adminUsuario) {
        DetallePrestamo dp = detallePrestamoRepository.findById(prestamoId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        System.out.println("Ver desde procesarPRestamo: "+adminUsuario);
        Estado nuevoEstado;
        if (aprobar) {
            TipoPrestamo tp = dp.getTipoPrestamo();
            if (tp == null) {
                throw new RuntimeException("Falta el tipo de préstamo para id=" + prestamoId);
            }

// mapeo de los tres casos a cadenas exactas de tu tabla ESTADO
            String desc = tp == TipoPrestamo.EN_SALA
                    ? "PRESTADO EN SALA"
                    : tp == TipoPrestamo.PRESTAMO_A_DOMICILIO
                    ? "PRESTAMO A DOMICILIO"
                    : "PRESTADO EN SALA Y DOMICILIO";

            nuevoEstado = estadoRepository
                    .findByDescripcionIgnoreCase(desc)
                    .orElseThrow(() -> new RuntimeException("Estado ‘" + desc + "’ no existe"));

            dp.setFechaPrestamo(LocalDateTime.now());
            dp.setUsuarioPrestamo(adminUsuario);
            // también actualizar estado del equipo
            dp.getEquipo().setEstado(nuevoEstado);
            equipoRepository.save(dp.getEquipo());

            // notificación de aprobación
            notificacionService.crearNotificacion(
                    dp.getCodigoUsuario(),
                    "Tu préstamo de " + dp.getEquipo().getNombreEquipo() +
                            " fue aprobado como “" + desc + "”."
            );
            emailService.sendLoanConfirmation(dp);
            emailService.sendAdminNotification(dp);

            scheduleReminder(dp, 2, ChronoUnit.MINUTES);
            scheduleReminder(dp, 3, ChronoUnit.MINUTES);
        } else {
            // rechazo → “DISPONIBLE”
            nuevoEstado = estadoRepository
                    .findByDescripcionIgnoreCase("DISPONIBLE")
                    .orElseThrow(() -> new RuntimeException("Estado ‘DISPONIBLE’ no existe"));

            // revertir estado del equipo
            dp.getEquipo().setEstado(nuevoEstado);
            equipoRepository.save(dp.getEquipo());
            boolean canceladoPorUsuario = adminUsuario != null && adminUsuario.equals(dp.getCodigoUsuario());
            if (canceladoPorUsuario) {
                notificacionService.crearNotificacion(
                        dp.getCodigoUsuario(),
                        "Cancelaste tu solicitud de préstamo de " + dp.getEquipo().getNombreEquipo() + "."
                );
                emailService.sendLoanCancellation(dp);
            } else {
                notificacionService.crearNotificacion(
                        dp.getCodigoUsuario(),
                        "Tu solicitud de préstamo de " + dp.getEquipo().getNombreEquipo() +
                                " fue rechazada."
                );
                // envio de correo al usuario notificando el rechazo
                emailService.sendLoanRejection(dp);
            }
        }

        dp.setEstado(nuevoEstado);
        return detallePrestamoRepository.save(dp);
    }

    public List<DetallePrestamo> buscarPorEstado(String descripcionEstado) {
        // 1) traes todos los "RESERVADO"
        List<DetallePrestamo> todos = detallePrestamoRepository.findByEstado_Descripcion(descripcionEstado);

        // 2) obtienes la lista de IDs válidos (como Strings)
        Set<String> validSedes = sedeService
                .getSedesActivas()
                .stream()
                .map(s -> s.getId().toString())
                .collect(Collectors.toSet());

        // 3) filtras en memoria
        return todos.stream()
                .filter(dp -> validSedes.contains(dp.getCodigoSede()))
                .collect(Collectors.toList());
    }

    public List<DetallePrestamo> buscarPorCodigoUsuario(String codigoUsuario) {
        return detallePrestamoRepository.findByCodigoUsuario(codigoUsuario);
    }

    public List<DetallePrestamo> buscarPorSedeYEstado(String codigoSede, String descripcionEstado) {
        return detallePrestamoRepository
                .findByCodigoSedeAndEstado_DescripcionIgnoreCase(codigoSede, descripcionEstado);
    }

    /**
     * Devuelve el historial de préstamos de un equipo.
     * Si se envía una sede, se filtra además por dicho código de sede.
     */
    public List<DetallePrestamo> listarPrestamosPorEquipo(Long equipoId, Long sedeId) {
        if (sedeId != null) {
            return detallePrestamoRepository.findByEquipo_IdEquipoAndCodigoSede(equipoId, sedeId.toString());
        }
        return detallePrestamoRepository.findByEquipo_IdEquipo(equipoId);
    }

    public LocalDateTime obtenerProximoFin(Long equipoId) {
        return detallePrestamoRepository
                .findTopByEquipo_IdEquipoOrderByFechaFinDesc(equipoId)
                .map(DetallePrestamo::getFechaFin)
                .orElse(null);
    }

    /**
     * Para el listado de devoluciones: solo PRESTADO EN SALA/A DOMICILIO,
     * y si pasan sedeId != null, filtra por ese código de sede.
     */
    public List<DetallePrestamo> buscarParaDevolucion(String sedeId) {
        List<String> estados = List.of("PRESTADO EN SALA", "PRESTAMO A DOMICILIO");
        if (sedeId != null && !sedeId.equals("0")) {
            return detallePrestamoRepository
                    .findByEstado_DescripcionInAndCodigoSedeIgnoreCase(estados, sedeId);
        } else {
            return detallePrestamoRepository
                    .findByEstado_DescripcionIn(estados);
        }
    }

    /**
     * Marca como devuelto:
     *  - fechaRecepcion = now()
     *  - usuarioRecepcion = quien llama
     *  - equipo.estado = DISPONIBLE
     *  - detalle.estado = DISPONIBLE
     */
    public DetallePrestamo recepcionarPrestamo(Long prestamoId, String usuario) {
        DetallePrestamo dp = detallePrestamoRepository.findById(prestamoId)
                .orElseThrow(() -> new RuntimeException("No existe préstamo " + prestamoId));

        Estado disponible = estadoRepository
                .findByDescripcionIgnoreCase("DISPONIBLE")
                .orElseThrow(() -> new RuntimeException("Estado 'DISPONIBLE' no existe"));

        dp.setFechaRecepcion(LocalDateTime.now());
        dp.setUsuarioRecepcion(usuario);
        dp.setEstado(disponible);

        // también actualizar el equipo
        Equipo eq = dp.getEquipo();
        eq.setEstado(disponible);
        equipoRepository.save(eq);

        return detallePrestamoRepository.save(dp);
    }

    public Object regularizarPrestamo(Map<String, Object> datos, String usuario) {
        // Caso 1: regularización de préstamo de equipos (biblioteca virtual)
        if (datos.get("idEquipo") != null) {
            Long equipoId = parseLong(datos.get("idEquipo"));
            if (equipoId == null) {
                throw new RuntimeException("Equipo inválido");
            }
            Equipo eq = equipoRepository.findById(equipoId)
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

            DetallePrestamo dp = new DetallePrestamo();
            dp.setEquipo(eq);

            Integer tipoUsuario = parseInt(datos.get("tipoUsuario"));
            if (tipoUsuario != null) {
                dp.setTipoUsuario(tipoUsuario);
            }

            if (datos.get("usuario") instanceof Map<?, ?> u) {
                Object cod = u.get("codigoUsuario");
                if (cod != null) {
                    dp.setCodigoUsuario(cod.toString());
                }
            }

            Object sede = datos.get("sedeId");
            if (sede != null) {
                dp.setCodigoSede(sede.toString());
            }

            LocalDate fechaPrestamo = parseFecha(datos.get("fechaPrestamo"));
            LocalTime horaInicio = parseHora(datos.get("horaInicio"));
            if (fechaPrestamo == null) {
                fechaPrestamo = LocalDate.now();
            }
            if (horaInicio == null) {
                horaInicio = LocalTime.MIDNIGHT;
            }
            LocalDateTime inicio = LocalDateTime.of(fechaPrestamo, horaInicio);
            dp.setFechaPrestamo(inicio);
            dp.setFechaInicio(inicio);

            LocalDate fechaDev = parseFecha(datos.get("fechaDevolucion"));
            LocalTime horaFin = parseHora(datos.get("horaFin"));
            if (fechaDev != null || horaFin != null) {
                LocalDateTime fin = LocalDateTime.of(
                        fechaDev != null ? fechaDev : fechaPrestamo,
                        horaFin != null ? horaFin : LocalTime.MIDNIGHT);
                dp.setFechaFin(fin);
            }

            if (datos.get("usuarioPrestamo") instanceof Map<?, ?> up) {
                Object desc = up.get("descripcion");
                dp.setUsuarioPrestamo(desc != null ? desc.toString() : usuario);
            } else {
                dp.setUsuarioPrestamo(usuario);
            }

            TipoPrestamo tp = TipoPrestamo.EN_SALA;
            dp.setTipoPrestamo(tp);
            Estado estado = estadoRepository.findByDescripcionIgnoreCase(tp.getEstadoDesc())
                    .orElseThrow(() -> new RuntimeException("Estado '" + tp.getEstadoDesc() + "' no existe"));
            dp.setEstado(estado);
            eq.setEstado(estado);
            equipoRepository.save(eq);

            dp = detallePrestamoRepository.save(dp);
            return dp;
        }

        // Caso 2: regularización de material bibliográfico
        Long numeroIngreso = parseLong(datos.get("numeroIngreso"));
        if (numeroIngreso == null) {
            throw new RuntimeException("Número de ingreso inválido");
        }
        DetalleBiblioteca det = detalleBibliotecaRepository.findFirstByNumeroIngreso(numeroIngreso)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));

        if (datos.get("usuarioPrestamo") instanceof Map<?, ?> up) {
            Object desc = up.get("descripcion");
            det.setUsuarioPrestamo(desc != null ? desc.toString() : null);
        }
        if (datos.get("usuario") instanceof Map<?, ?> u) {
            Object cod = u.get("codigoUsuario");
            if (cod != null) {
                det.setCodigoUsuario(cod.toString());
            }
        }
        LocalDate fechaInicio = parseFecha(datos.get("fechaPrestamo"));
        LocalTime horaInicio = parseHora(datos.get("horaInicio"));
        if (fechaInicio == null) {
            fechaInicio = LocalDate.now();
        }
        if (horaInicio == null) {
            horaInicio = LocalTime.MIDNIGHT;
        }
        det.setFechaPrestamo(LocalDateTime.of(fechaInicio, horaInicio));
        det.setFechaInicio(fechaInicio);
        det.setHoraInicio(horaInicio.toString());

        LocalDate fechaFin = parseFecha(datos.get("fechaDevolucion"));
        LocalTime horaFin = parseHora(datos.get("horaFin"));
        det.setFechaFin(fechaFin);
        if (horaFin != null) {
            det.setHoraFin(horaFin.toString());
        }
        det.setUsuarioModificacion(usuario);

        String tipo = det.getTipoPrestamo();
        final String descEstado = (tipo != null
                && tipo.trim().toUpperCase().replace(' ', '_').contains("DOMICILIO"))
                ? "PRESTAMO A DOMICILIO"
                : "PRESTADO EN SALA";

        Estado estado = estadoRepository.findByDescripcionIgnoreCase(descEstado)
                .orElseThrow(() -> new RuntimeException("Estado '" + descEstado + "' no existe"));
        det.setIdEstado(estado.getIdEstado());
        det.setCantidadPrestamos((det.getCantidadPrestamos() == null ? 0 : det.getCantidadPrestamos()) + 1);

        DetalleBiblioteca saved = detalleBibliotecaRepository.save(det);
        return bibliotecaMapper.toDetalleDto(saved);
    }

    private Integer parseInt(Object valor) {
        if (valor instanceof Number n) {
            return n.intValue();
        }
        if (valor instanceof String s && !s.isBlank() && !"null".equalsIgnoreCase(s)) {
            try {
                return Integer.valueOf(s);
            } catch (NumberFormatException ignore) {
            }
        }
        return null;
    }

    private Long parseLong(Object valor) {
        if (valor instanceof Number n) {
            return n.longValue();
        }
        if (valor instanceof String s && !s.isBlank() && !"null".equalsIgnoreCase(s)) {
            try {
                return Long.valueOf(s);
            } catch (NumberFormatException ignore) {
            }
        }
        return null;
    }

    private LocalDate parseFecha(Object valor) {
        if (valor instanceof String s && !s.isBlank()) {
            try {
                return s.contains("T") ? LocalDateTime.parse(s).toLocalDate() : LocalDate.parse(s);
            } catch (DateTimeParseException ignore) {
            }
        }
        return null;
    }

    private LocalTime parseHora(Object valor) {
        if (valor instanceof String s && !s.isBlank()) {
            try {
                return s.contains("T") ? LocalDateTime.parse(s).toLocalTime() : LocalTime.parse(s);
            } catch (DateTimeParseException ignore) {
            }
        }
        return null;
    }

    public List<DetallePrestamo> reporte(
            String sede,
            Integer tipoUsuario,
            String estado,
            String escuela,
            String programa,
            String ciclo,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    ) {
        return detallePrestamoRepository.findAll(
                Specification.where(conFetchEquipoYSede())
                        .and(DetallePrestamoSpecs.porSede(sede))
                        .and(DetallePrestamoSpecs.porTipoUsuario(tipoUsuario))
                        .and(DetallePrestamoSpecs.porTipoPrestamo(estado))
                        .and(DetallePrestamoSpecs.porEscuela(escuela))
                        .and(DetallePrestamoSpecs.porPrograma(programa))
                        .and(DetallePrestamoSpecs.porCiclo(ciclo))
                        .and(DetallePrestamoSpecs.entreFechas(fechaInicio, fechaFin))
                        .and(DetallePrestamoSpecs.entreFechas(fechaInicio, fechaFin)),
                Sort.by(Sort.Direction.DESC, "id")
        );
    }

    public DetallePrestamo buscarPorId(Long id) {
        return detallePrestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DetallePrestamo no encontrado: " + id));
    }

    public List<com.miapp.model.dto.UsuarioPrestamosDTO> reporteEstudiantesAtendidos(
            String sede,
            String especialidad,
            String programa,
            String ciclo,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    ) {
        return detallePrestamoRepository.contarPrestamosPorUsuario(
                sede,
                especialidad,
                programa,
                ciclo,
                fechaInicio,
                fechaFin
        );
    }

    /**
     * Reporte de usuarios atendidos en biblioteca virtual.
     * Considera únicamente los préstamos aprobados.
     */
    public List<com.miapp.model.dto.UsuarioEquipoPrestamosDTO> reporteUsuariosAtendidosBiblioteca() {
        return detallePrestamoRepository.contarPrestamosEquipoPorUsuario();
    }

    public List<com.miapp.model.dto.EquipoUsoTiempoDTO> reporteUsoTiempoBiblioteca(
            String sede,
            Integer tipoUsuario,
            String ciclo,
            String escuela,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    ) {
        List<DetallePrestamo> prestamos = detallePrestamoRepository.findAll(
                Specification.where(conFetchEquipoYSede())
                        .and(DetallePrestamoSpecs.porSede(sede))
                        .and(DetallePrestamoSpecs.porTipoUsuario(tipoUsuario))
                        .and(DetallePrestamoSpecs.porCiclo(ciclo))
                        .and(DetallePrestamoSpecs.porEscuela(escuela))
                        .and(DetallePrestamoSpecs.entreFechas(fechaInicio, fechaFin))
                        // se ignoran los préstamos en estado "RESERVADO"
                        .and(DetallePrestamoSpecs.excluirEstadoDescripcion("RESERVADO"))
        );

        Map<Equipo, List<DetallePrestamo>> agrupado = prestamos.stream()
                .collect(Collectors.groupingBy(DetallePrestamo::getEquipo));

        List<com.miapp.model.dto.EquipoUsoTiempoDTO> lista = new ArrayList<>();
        for (Map.Entry<Equipo, List<DetallePrestamo>> entry : agrupado.entrySet()) {
            Equipo eq = entry.getKey();
            List<DetallePrestamo> dps = entry.getValue();

            long cantidad = dps.size();
            double horas = dps.stream()
                    .mapToDouble(dp -> {
                        LocalDateTime ini = dp.getFechaInicio();
                        LocalDateTime fin = dp.getFechaFin() != null ? dp.getFechaFin() : LocalDateTime.now();
                        return java.time.Duration.between(ini, fin).toMinutes() / 60d;
                    })
                    .sum();

            String sedeDesc = eq.getSede() != null ? eq.getSede().getDescripcion() : null;
            lista.add(new com.miapp.model.dto.EquipoUsoTiempoDTO(
                    sedeDesc,
                    eq.getNombreEquipo(),
                    eq.getNumeroEquipo() != null ? eq.getNumeroEquipo().toString() : null,
                    cantidad,
                    horas
            ));
        }

        return lista;
    }

    /**
     * Reporte de visitas a la intranet de biblioteca.
     * Aplica filtros básicos y devuelve una lista de visitas.
     */
    public List<IntranetVisitaDTO> reporteVisitasBibliotecaIntranet(
            String sede,
            Integer tipoUsuario,
            String estado,
            String escuela,
            String programa,
            String ciclo,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    ) {
        StringBuilder sql = new StringBuilder(
                "SELECT v.TIPOUSUARIO, v.SUBTIPOUSUARIO, v.PROGRAMA, v.PACPRO, v.IDVISITABIBVIR, " +
                        "v.IDSITUACIONALUMNO, v.IDBIBVIR, v.HORASALIDA, v.HORAINGRESO, v.FLGUSUARIO, " +
                        "v.FECHAREGISTRO, v.CODIGOUSUARIO, v.CODIGOSEDE, v.CODIGOESPECIALIDAD, v.CICLO, " +
                        "COUNT(*) OVER (PARTITION BY COALESCE(NULLIF(TRIM(UPPER(v.CODIGOUSUARIO)), ''), 'SIN_CODIGO')) AS TOTAL_VISITAS " +
                        "FROM VISITASBIBVIR v WHERE 1=1");

        List<Object> params = new ArrayList<>();
        sql.append(" AND COALESCE(v.FLGUSUARIO, 0) IN (?, ?)");
        params.add(VisitaBibliotecaVirtualEstado.INGRESO_PRESENCIAL);
        params.add(VisitaBibliotecaVirtualEstado.SALIDA_PRESENCIAL);
        if (sede != null) {
            sql.append(" AND v.CODIGOSEDE = ?");
            params.add(sede);
        }
        if (tipoUsuario != null) {
            sql.append(" AND v.TIPOUSUARIO = ?");
            params.add(tipoUsuario);
        }
        if (estado != null) {
            sql.append(" AND v.FLGUSUARIO = ?");
            params.add(estado);
        }
        if (escuela != null) {
            sql.append(" AND v.CODIGOESPECIALIDAD = ?");
            params.add(escuela);
        }
        if (programa != null) {
            sql.append(" AND v.PROGRAMA = ?");
            params.add(programa);
        }
        if (ciclo != null) {
            sql.append(" AND v.CICLO = ?");
            params.add(ciclo);
        }
        if (fechaInicio != null) {
            sql.append(" AND v.FECHAREGISTRO >= ?");
            params.add(java.sql.Timestamp.valueOf(fechaInicio));
        }
        if (fechaFin != null) {
            sql.append(" AND v.FECHAREGISTRO <= ?");
            params.add(java.sql.Timestamp.valueOf(fechaFin));
        }

        sql.append(" ORDER BY v.FECHAREGISTRO DESC");

        return jdbcTemplate.query(
                sql.toString(),
                params.toArray(),
                (rs, rowNum) -> new IntranetVisitaDTO(
                        rs.getString("TIPOUSUARIO"),
                        rs.getString("SUBTIPOUSUARIO"),
                        rs.getString("PROGRAMA"),
                        rs.getString("PACPRO"),
                        rs.getString("IDVISITABIBVIR"),
                        rs.getString("IDSITUACIONALUMNO"),
                        rs.getString("IDBIBVIR"),
                        rs.getString("HORASALIDA"),
                        rs.getString("HORAINGRESO"),
                        rs.getString("FLGUSUARIO"),
                        rs.getTimestamp("FECHAREGISTRO").toLocalDateTime(),
                        rs.getString("CODIGOUSUARIO"),
                        rs.getString("CODIGOSEDE"),
                        rs.getString("CODIGOESPECIALIDAD"),
                        rs.getString("CICLO"),
                        rs.getLong("TOTAL_VISITAS")
                )
        );
    }
    /**
     * Reporte de visitantes de biblioteca virtual.
     * Devuelve la cantidad de ocurrencias registradas por usuario dentro del rango indicado.
     *
     * @param fechaInicio      instante inicial (inclusive) del filtro.
     * @param fechaFinExclusiva instante final (exclusivo) del filtro; usar inicio del día siguiente para cortes diarios.
     * @param codigoUsuario    identificador opcional a filtrar.
     */
    public List<VisitanteBibliotecaVirtualDTO> reporteVisitantesBibliotecaVirtual(
            java.time.LocalDateTime fechaInicio,
            java.time.LocalDateTime fechaFinExclusiva,
            String codigoUsuario,
            String codigoSede,
            Integer tipoUsuario,
            String codigoEscuela,
            String codigoPrograma,
            String ciclo,
            Long baseId) {
        String codigoNormalizado = normalizarCodigoUsuario(codigoUsuario);
        String sedeNormalizada = normalizarFiltroTexto(codigoSede);
        String escuelaNormalizada = normalizarFiltroTexto(codigoEscuela);
        String programaNormalizado = normalizarFiltroTexto(codigoPrograma);
        String cicloNormalizado = normalizarFiltroTexto(ciclo);

        // Usa la marca temporal más reciente disponible (salida, ingreso o registro) para filtrar dentro del rango solicitado.
        StringBuilder sql = new StringBuilder("""
                WITH VISITAS_BASE AS (
                    SELECT
                        TRIM(UPPER(v.CODIGOUSUARIO)) AS CODIGO_VISITA,
                        TRIM(v.CODIGOUSUARIO) AS CODIGO_VISITA_ORIGINAL,
                        v.IDBIBVIR,
                        GREATEST(
                            COALESCE(CAST(v.HORASALIDA AS TIMESTAMP), TIMESTAMP '1970-01-01 00:00:00'),
                            COALESCE(CAST(v.HORAINGRESO AS TIMESTAMP), TIMESTAMP '1970-01-01 00:00:00'),
                            COALESCE(CAST(v.FECHAREGISTRO AS TIMESTAMP), TIMESTAMP '1970-01-01 00:00:00')
                        ) AS FECHA_REFERENCIA,
                        TRIM(UPPER(v.CODIGOSEDE)) AS CODIGO_SEDE,
                        v.TIPOUSUARIO,
                        TRIM(UPPER(v.CODIGOESPECIALIDAD)) AS CODIGO_ESCUELA,
                        TRIM(UPPER(v.PROGRAMA)) AS CODIGO_PROGRAMA,
                        TRIM(UPPER(v.CICLO)) AS CODIGO_CICLO
                    FROM VISITASBIBVIR v
                    WHERE v.CODIGOUSUARIO IS NOT NULL
                      AND TRIM(v.CODIGOUSUARIO) <> ''
                      AND COALESCE(v.FLGUSUARIO, 0) = :estadoVisitaVirtual
                ),
                VISITAS_FILTRADAS AS (
                    SELECT
                        CODIGO_VISITA,
                        CODIGO_VISITA_ORIGINAL,
                        IDBIBVIR,
                        FECHA_REFERENCIA
                    FROM VISITAS_BASE vf
                    WHERE 1 = 1
                """);

        MapSqlParameterSource parametros = new MapSqlParameterSource();
        parametros.addValue("estadoVisitaVirtual", VisitaBibliotecaVirtualEstado.INGRESO_VIRTUAL);
        aplicarFiltrosVisitas(sql, parametros, fechaInicio, fechaFinExclusiva,
                sedeNormalizada, tipoUsuario, escuelaNormalizada, programaNormalizado, cicloNormalizado, baseId,
                "vf");

        sql.append("""
                ),
                VISITAS_AGRUPADAS AS (
                    SELECT
                        CODIGO_VISITA,
                        CODIGO_VISITA_ORIGINAL,
                        IDBIBVIR,
                        COUNT(*) AS TOTAL_VISITAS
                    FROM VISITAS_FILTRADAS
                    GROUP BY
                        CODIGO_VISITA,
                        CODIGO_VISITA_ORIGINAL,
                        IDBIBVIR
                ),
                SESIONES_POR_USUARIO AS (
                    SELECT
                        CODIGO_VISITA,
                        SUM(TOTAL_VISITAS) AS TOTAL_SESIONES
                    FROM VISITAS_AGRUPADAS
                    GROUP BY CODIGO_VISITA
                )
                SELECT
                    s.DESCRIPCION AS SEDE,
                    COALESCE(tbv.NOMBRE, 'N/A') AS BASE_DATOS,
                    u.LOGIN AS LOGIN_USUARIO,
                    va.CODIGO_VISITA_ORIGINAL AS CODIGO_VISITA,
                    u.APELLIDOPATERNO,
                    u.APELLIDOMATERNO,
                    u.NOMBREUSUARIO,
                    MAX(r.DESCRIPCION) AS ROL_DESCRIPCION,
                    e.DESCRIPCION AS ESPECIALIDAD,
                    p.DESCRIPCION_PROGRAMA AS PROGRAMA,
                    u.CICLO,
                    u.EMAIL,
                    va.TOTAL_VISITAS,
                    COALESCE(su.TOTAL_SESIONES, va.TOTAL_VISITAS) AS TOTAL_SESIONES
                FROM VISITAS_AGRUPADAS va
                LEFT JOIN SESIONES_POR_USUARIO su ON su.CODIGO_VISITA = va.CODIGO_VISITA
                LEFT JOIN USUARIO u ON (
                        UPPER(TRIM(u.LOGIN)) = va.CODIGO_VISITA
                     OR UPPER(TRIM(u.EMAIL)) = va.CODIGO_VISITA
                     OR (u.EMPLID IS NOT NULL AND UPPER(TRIM(u.EMPLID)) = va.CODIGO_VISITA)
                )
                LEFT JOIN USUARIO_ROL ur ON ur.IDUSUARIO = u.IDUSUARIO
                LEFT JOIN ROLUSUARIO r ON r.IDROL = ur.IDROL
                LEFT JOIN ESPECIALIDAD e ON e.IDESPECIALIDAD = u.IDESPECIALIDAD
                LEFT JOIN PROGRAMA p ON p.IDPROGRAMA = u.IDPROGRAMA
                LEFT JOIN SEDE s ON s.ID = u.IDSEDE
                LEFT JOIN TIPOBIBLIOTECAVIRTUAL tbv ON tbv.IDTIPOBIBVIRTUAL = va.IDBIBVIR
                WHERE 1 = 1
                """);

        if (codigoNormalizado != null) {
            sql.append(" AND ("
                    + " va.CODIGO_VISITA = :codigoFiltro"
                    + " OR (u.LOGIN IS NOT NULL AND UPPER(TRIM(u.LOGIN)) = :codigoFiltro)"
                    + " OR (u.EMAIL IS NOT NULL AND UPPER(TRIM(u.EMAIL)) = :codigoFiltro)"
                    + " OR (u.EMPLID IS NOT NULL AND UPPER(TRIM(u.EMPLID)) = :codigoFiltro)"
                    + ")");
            parametros.addValue("codigoFiltro", codigoNormalizado);
        }

        sql.append("""
                GROUP BY
                    s.DESCRIPCION,
                    COALESCE(tbv.NOMBRE, 'N/A'),
                    u.LOGIN,
                    va.CODIGO_VISITA,
                    va.CODIGO_VISITA_ORIGINAL,
                    u.APELLIDOPATERNO,
                    u.APELLIDOMATERNO,
                    u.NOMBREUSUARIO,
                    e.DESCRIPCION,
                    p.DESCRIPCION_PROGRAMA,
                    u.CICLO,
                    u.EMAIL,
                    va.TOTAL_VISITAS,
                    su.TOTAL_SESIONES
                ORDER BY
                    TOTAL_SESIONES DESC,
                    va.TOTAL_VISITAS DESC,
                    va.CODIGO_VISITA_ORIGINAL
                """);

        String sqlFinal = sql.toString();
        System.out.println("[Reporte Visitantes Biblioteca Virtual][Backend] SQL generada:\n" + sqlFinal);
        System.out.println("[Reporte Visitantes Biblioteca Virtual][Backend] Parámetros SQL: " + parametros.getValues());

        List<VisitanteBibliotecaVirtualDTO> filas = namedParameterJdbcTemplate.query(
                sqlFinal,
                parametros,
                (rs, rowNum) -> mapearResumenVisitanteVirtual(rs)
        );

        if (filas.isEmpty()) {
            return filas;
        }

        Comparator<VisitanteBibliotecaVirtualDTO> orden = Comparator
                .comparingLong((VisitanteBibliotecaVirtualDTO dto) -> safeLong(dto.getTotalSesiones()))
                .reversed()
                .thenComparing(Comparator.comparingLong((VisitanteBibliotecaVirtualDTO dto) -> safeLong(dto.getTotalVisitas())).reversed())
                .thenComparing(dto -> textoSeguro(dto.getCodigo(), ""), String.CASE_INSENSITIVE_ORDER);
        filas.sort(orden);

        return filas;
    }

    private void aplicarFiltrosVisitas(StringBuilder sql,
                                       MapSqlParameterSource params,
                                       LocalDateTime fechaInicio,
                                       LocalDateTime fechaFinExclusiva,
                                       String sedeNormalizada,
                                       Integer tipoUsuario,
                                       String escuelaNormalizada,
                                       String programaNormalizado,
                                       String cicloNormalizado,
                                       Long baseId,
                                       String aliasTabla) {
        String fechaReferenciaExpr = aliasTabla + ".FECHA_REFERENCIA";
        if (fechaInicio != null) {
            sql.append(" AND ").append(fechaReferenciaExpr).append(" >= :fechaInicio\n");
            params.addValue("fechaInicio", java.sql.Timestamp.valueOf(fechaInicio));
        }
        if (fechaFinExclusiva != null) {
            sql.append(" AND ").append(fechaReferenciaExpr).append(" < :fechaFinExclusiva\n");
            params.addValue("fechaFinExclusiva", java.sql.Timestamp.valueOf(fechaFinExclusiva));
        }
        if (sedeNormalizada != null) {
            sql.append(" AND ").append(aliasTabla).append(".CODIGO_SEDE = :codigoSede\n");
            params.addValue("codigoSede", sedeNormalizada);
        }
        if (tipoUsuario != null && tipoUsuario != 0) {
            sql.append(" AND ").append(aliasTabla).append(".TIPOUSUARIO = :tipoUsuario\n");
            params.addValue("tipoUsuario", tipoUsuario);
        }
        if (escuelaNormalizada != null) {
            sql.append(" AND ").append(aliasTabla).append(".CODIGO_ESCUELA = :codigoEscuela\n");
            params.addValue("codigoEscuela", escuelaNormalizada);
        }
        if (programaNormalizado != null) {
            sql.append(" AND ").append(aliasTabla).append(".CODIGO_PROGRAMA = :codigoPrograma\n");
            params.addValue("codigoPrograma", programaNormalizado);
        }
        if (cicloNormalizado != null) {
            sql.append(" AND ").append(aliasTabla).append(".CODIGO_CICLO = :codigoCiclo\n");
            params.addValue("codigoCiclo", cicloNormalizado);
        }
        if (baseId != null && baseId != 0L) {
            sql.append(" AND ").append(aliasTabla).append(".IDBIBVIR = :baseId\n");
            params.addValue("baseId", baseId);
        }

        // Solo aplica filtros dinámicos sobre el CTE VISITAS_FILTRADAS (alias vf).
        // El armado del SELECT final y la ejecución se realizan en el método llamante.
    }

    /**
     * Reporte agregado de visitantes de biblioteca virtual por día.
     */
    public List<VisitantesPorDiaDTO> reporteVisitantesBibliotecaVirtualPorDia(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFinExclusiva
    ) {
        return visitaBibliotecaVirtualRepository.contarVisitasPorDia(fechaInicio, fechaFinExclusiva);
    }

    private VisitanteBibliotecaVirtualDTO mapearResumenVisitanteVirtual(ResultSet rs) throws SQLException {
        String sede = textoSeguro(rs.getString("SEDE"), "-");
        String baseDatos = textoSeguro(rs.getString("BASE_DATOS"), "N/A");
        String login = textoSeguro(rs.getString("LOGIN_USUARIO"), null);
        String codigoVisita = textoSeguro(rs.getString("CODIGO_VISITA"), null);
        String codigo = !esBlanco(login) ? login : textoSeguro(codigoVisita, "-");

        String apellidosNombres = concatenarNombre(
                textoSeguro(rs.getString("APELLIDOPATERNO"), null),
                textoSeguro(rs.getString("APELLIDOMATERNO"), null),
                textoSeguro(rs.getString("NOMBREUSUARIO"), null));
        if (esBlanco(apellidosNombres)) {
            apellidosNombres = codigo;
        }

        String tipoUsuario = textoSeguro(rs.getString("ROL_DESCRIPCION"), "Sin Rol");
        String especialidad = textoSeguro(rs.getString("ESPECIALIDAD"), "-");
        String programa = textoSeguro(rs.getString("PROGRAMA"), "-");
        String cicloUsuario = textoSeguro(rs.getString("CICLO"), "-");
        String correo = textoSeguro(rs.getString("EMAIL"), "-");
        long totalVisitas = readLong(rs, "TOTAL_VISITAS");
        long totalSesiones = readLong(rs, "TOTAL_SESIONES");
        if (totalSesiones <= 0L) {
            totalSesiones = totalVisitas;
        }
        return new VisitanteBibliotecaVirtualDTO(
                sede,
                baseDatos,
                codigo,
                apellidosNombres,
                tipoUsuario,
                especialidad,
                programa,
                cicloUsuario,
                correo,
                totalVisitas,
                totalSesiones
        );
    }

    private long readLong(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? 0L : value;
    }

    private long safeLong(Long valor) {
        return valor != null ? valor : 0L;
    }

    private String normalizarCodigoUsuario(String codigo) {
        if (codigo == null) {
            return null;
        }
        String valor = codigo.trim();
        if (valor.isEmpty()) {
            return null;
        }
        return valor.toUpperCase();
    }

    private String normalizarFiltroTexto(String valor) {
        if (valor == null) {
            return null;
        }
        String trimmed = valor.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.toUpperCase();
    }

    private String textoSeguro(Object valor, String porDefecto) {
        if (valor == null) {
            return porDefecto;
        }
        String texto = valor.toString().trim();
        return texto.isEmpty() ? porDefecto : texto;
    }

    private boolean esBlanco(String valor) {
        return valor == null || valor.trim().isEmpty();
    }

    private String concatenarNombre(String paterno, String materno, String nombres) {
        StringBuilder sb = new StringBuilder();
        if (!esBlanco(paterno)) {
            sb.append(paterno.trim());
        }
        if (!esBlanco(materno)) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(materno.trim());
        }
        if (!esBlanco(nombres)) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(nombres.trim());
        }
        return sb.toString();
    }

}