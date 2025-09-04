package com.miapp.service;

import com.miapp.model.DetallePrestamo;
import com.miapp.model.Equipo;
import com.miapp.model.Estado;
import com.miapp.model.TipoPrestamo;
import com.miapp.repository.DetallePrestamoRepository;
import com.miapp.repository.EquipoRepository;
import com.miapp.repository.EstadoRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.repository.UsuarioRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.spec.DetallePrestamoSpecs;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

            notificacionService.crearNotificacion(
                    dp.getCodigoUsuario(),
                    "Tu solicitud de préstamo de " + dp.getEquipo().getNombreEquipo() +
                            " fue rechazada."
            );
            // envio de correo al usuario notificando el rechazo
            emailService.sendLoanRejection(dp);
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

    public List<com.miapp.model.dto.UsuarioPrestamosDTO> reporteEstudiantesAtendidos() {
        return detallePrestamoRepository.contarPrestamosPorUsuario();
    }

    /**
     * Reporte de usuarios atendidos en biblioteca virtual.
     * Considera únicamente los préstamos aprobados.
     */
    public List<com.miapp.model.dto.UsuarioEquipoPrestamosDTO> reporteUsuariosAtendidosBiblioteca() {
        return detallePrestamoRepository.contarPrestamosEquipoPorUsuario();
    }

    public List<com.miapp.model.dto.EquipoUsoTiempoDTO> reporteUsoTiempoBiblioteca(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    ) {
        List<DetallePrestamo> prestamos = detallePrestamoRepository.findAll(
                Specification.where(conFetchEquipoYSede())
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
     * Reporte de visitantes de biblioteca virtual.
     * Devuelve la cantidad de ocurrencias registradas por usuario.
     */
    public List<com.miapp.model.dto.VisitanteBibliotecaVirtualDTO> reporteVisitantesBibliotecaVirtual() {
        return usuarioRepository.reporteVisitantesBibliotecaVirtual();
    }

}

