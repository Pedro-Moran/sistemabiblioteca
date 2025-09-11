package com.miapp.service;

import com.miapp.model.DetallePrestamo;
import com.miapp.model.Equipo;
import com.miapp.model.Estado;
import com.miapp.model.TipoPrestamo;
import com.miapp.model.DetalleBiblioteca;
import com.miapp.model.dto.DetalleBibliotecaDTO;
import com.miapp.mapper.BibliotecaMapper;
import com.miapp.repository.DetallePrestamoRepository;
import com.miapp.repository.DetalleBibliotecaRepository;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.EstadoRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.repository.UsuarioRepository;
import com.miapp.spec.DetallePrestamoSpecs;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import com.miapp.model.dto.IntranetVisitaDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.ArrayList;

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
    private final BibliotecaMapper bibliotecaMapper;
    private final JdbcTemplate jdbcTemplate;

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
                                             String usuarioLogueado) {
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
                        "v.FECHAREGISTRO, v.CODIGOUSUARIO, v.CODIGOSEDE, v.CODIGOESPECIALIDAD, v.CICLO " +
                        "FROM VISITASBIBVIR v WHERE 1=1");

        List<Object> params = new ArrayList<>();
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
                        rs.getString("CICLO")
                )
        );
    }
    /**
     * Reporte de visitantes de biblioteca virtual.
     * Devuelve la cantidad de ocurrencias registradas por usuario.
     */
    public List<com.miapp.model.dto.VisitanteBibliotecaVirtualDTO> reporteVisitantesBibliotecaVirtual() {
        return usuarioRepository.reporteVisitantesBibliotecaVirtual();
    }

}

