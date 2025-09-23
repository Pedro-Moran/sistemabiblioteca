package com.miapp.controller;

import com.miapp.model.*;
import com.miapp.model.dto.OcurrenciaBibliotecaDTO;
import com.miapp.model.dto.UsuarioPrestamosDTO;
import com.miapp.model.dto.VisitanteBibliotecaVirtualDTO;
import com.miapp.model.dto.VisitantesPorDiaDTO;
import com.miapp.service.*;
import com.miapp.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping({"/auth/api/prestamos", "/api/prestamos"})
@RequiredArgsConstructor
public class PrestamoController {

    private final PrestamoService prestamoService;
    private final NotificacionService notificacionService;
    private final OcurrenciaBibliotecaService ocurrenciaBibliotecaService;
    private final UsuarioService usuarioService;
    private final EquipoService equipoService;
    private final RolRepository rolRepository;

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitar(@RequestBody SolicitudDTO dto,
                                       Authentication auth) {
        System.out.println(">> DTO recibido: " + dto);
        System.out.println(">> usuario recibido: " + auth.getName());
        String usuario = auth.getName();
        DetallePrestamo creado = prestamoService.solicitarPrestamo(
                dto.getEquipoId(),
                dto.getTipoUsuario(),
                dto.getCodigoUsuario(),
                dto.getCodigoSede(),
                dto.getCodigoSemestre(),
                dto.getCodigoPrograma(),
                dto.getCodigoEscuela(),
                dto.getCodigoTurno(),
                dto.getCodigoCiclo(),
                dto.getTipoPrestamo(),
                dto.getFechaInicio(),      // ← nuevo
                dto.getFechaFin(),         // ← nuevo
                usuario,
                dto.getEstadoPrograma(),
                dto.getMotaccion()
        );
        return ResponseEntity.ok(Map.of("status","0","data",creado));
    }

    @PostMapping("/procesar")
    public ResponseEntity<?> procesar(
            @RequestBody Map<String, Object> payload,
            Authentication auth) {

        Long id = Long.valueOf(payload.get("id").toString());
        boolean aprobar = Boolean.valueOf(payload.get("aprobar").toString());

        DetallePrestamo resultado =
                prestamoService.procesarPrestamo(id, aprobar, auth.getName());

        return ResponseEntity.ok(Map.of("status","0","data",resultado));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<?> pendientes(@RequestParam(required=false) String sedeId) {
        List<DetallePrestamo> lista;
        if (sedeId != null) {
            lista = prestamoService.buscarPorSedeYEstado(sedeId, "RESERVADO");
        } else {
            lista = prestamoService.buscarPorEstado("RESERVADO");
        }
        return ResponseEntity.ok(Map.of("status","0","data",lista));
    }

    @GetMapping("/no-leidas")
    public ResponseEntity<List<Notificacion>> listarNoLeidas(Authentication auth) {
        String usuario = auth.getName();
        System.out.println(usuario);
        List<Notificacion> pendientes = notificacionService.listarNoLeidas(usuario);
        return ResponseEntity.ok(pendientes);
    }

    @GetMapping("/notificaciones")
    public ResponseEntity<List<Notificacion>> listarTodas(Authentication auth) {
        String usuario = auth.getName();
        List<Notificacion> lista = notificacionService.listarTodas(usuario);
        return ResponseEntity.ok(lista);
    }

    /** Marca una notificación como leída */
    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id) {
        notificacionService.marcarLeida(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mis-prestamos")
    public ResponseEntity<?> misPrestamos(Authentication auth) {
        String usuario = auth.getName();
        List<DetallePrestamo> prestamos =
                prestamoService.buscarPorCodigoUsuario(usuario);
        return ResponseEntity.ok(Map.of("status","0","data",prestamos));
    }


    /** Lista para devolución (estado EN_SALA o PRESTAMO_A_DOMICILIO) */
    @GetMapping("/devoluciones")
    public ResponseEntity<?> devoluciones(
            @RequestParam(required=false) String sedeId
    ) {
        List<DetallePrestamo> lista = prestamoService
                .buscarParaDevolucion(sedeId);
        return ResponseEntity.ok(Map.of("status","0","data",lista));
    }

    /** Procesa la devolución */
    @PostMapping("/devolver")
    public ResponseEntity<?> devolver(
            @RequestBody Map<String, Object> payload,
            Authentication auth
    ) {
        Long id = Long.valueOf(payload.get("id").toString());
        DetallePrestamo resultado = prestamoService
                .recepcionarPrestamo(id, auth.getName());
        return ResponseEntity.ok(Map.of("status","0","data",resultado));
    }

    @PostMapping("/regularizar")
    public ResponseEntity<?> regularizar(
            @RequestBody Map<String, Object> payload,
            Authentication auth
    ) {
        var resultado = prestamoService.regularizarPrestamo(payload, auth.getName());
        return ResponseEntity.ok(Map.of("status","0","data", resultado));
    }


    @GetMapping("/reporte")
    public ResponseEntity<?> reporte(
            @RequestParam(required = false) String sede,
            @RequestParam(required = false) Integer tipoUsuario,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String escuela,
            @RequestParam(required = false) String programa,
            @RequestParam(required = false) String ciclo,
            @RequestParam String fechaInicio,   // recibo texto
            @RequestParam String fechaFin       // recibo texto
    ) {
        sede     = (sede     == null || sede.trim().isEmpty()  || "0".equals(sede))     ? null : sede;
        estado   = (estado   == null || estado.trim().isEmpty()|| "0".equals(estado))   ? null : estado;
        escuela  = (escuela  == null || escuela.trim().isEmpty()|| "0".equals(escuela))  ? null : escuela;
        programa = (programa == null || programa.trim().isEmpty()|| "0".equals(programa)) ? null : programa;
        ciclo    = (ciclo    == null || ciclo.trim().isEmpty()   || "0".equals(ciclo))   ? null : ciclo;

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate   fi  = LocalDate .parse(fechaInicio, fmt);
        LocalDate   ff  = LocalDate .parse(fechaFin,    fmt);
        LocalDateTime inicioDt = fi .atStartOfDay();
        LocalDateTime finDt    = ff .atTime(23,59,59);

        List<DetallePrestamo> lista = prestamoService
                .reporte(sede,
                        tipoUsuario,
                        estado,
                        escuela,
                        programa,
                        ciclo,
                        inicioDt,
                        finDt);

        return ResponseEntity.ok(Map.of("status","0","data",lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetallePrestamo(@PathVariable Long id) {
        DetallePrestamo dp = prestamoService.buscarPorId(id);
        return ResponseEntity.ok(Map.of("status","0","data", dp));
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long rol,
            @RequestParam(required = false, name = "tipo") Integer tipoBusqueda) {
        List<Usuario> lista = usuarioService.listar(search, rol, tipoBusqueda);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    /** Lista todos los tipos de usuario disponibles */
    @GetMapping("/tipos-usuario")
    public ResponseEntity<?> listarTiposUsuario() {
        List<Rol> roles = rolRepository.findAll();
        return ResponseEntity.ok(Map.of("status", "0", "data", roles));
    }

    @GetMapping("/reporte/estudiantes-atendidos")
    public ResponseEntity<?> reporteEstudiantesAtendidos(
            @RequestParam(required = false) Long sede,
            @RequestParam(required = false) Long especialidad,
            @RequestParam(required = false) Long programa,
            @RequestParam(required = false) Long ciclo,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        LocalDateTime inicio = fechaInicio != null ? LocalDate.parse(fechaInicio).atStartOfDay() : null;
        LocalDateTime fin    = fechaFin != null ? LocalDate.parse(fechaFin).atTime(23,59,59) : null;

        List<com.miapp.model.dto.UsuarioPrestamosDTO> lista = prestamoService.reporteEstudiantesAtendidos(
                sede != null ? sede.toString() : null,
                especialidad != null ? especialidad.toString() : null,
                programa != null ? programa.toString() : null,
                ciclo != null ? ciclo.toString() : null,
                inicio,
                fin
        );
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    @GetMapping("/reporte/usuarios-atendidos-biblioteca")
    public ResponseEntity<?> reporteUsuariosAtendidosBiblioteca() {
        List<com.miapp.model.dto.UsuarioEquipoPrestamosDTO> lista = prestamoService.reporteUsuariosAtendidosBiblioteca();
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    @GetMapping("/reporte/intranet")
    public ResponseEntity<?> reporteIntranet(
            @RequestParam(required = false) String sede,
            @RequestParam(required = false) Integer tipoUsuario,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String escuela,
            @RequestParam(required = false) String programa,
            @RequestParam(required = false) String ciclo,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        LocalDateTime inicio = parseDate(fechaInicio, false);
        LocalDateTime fin    = parseDate(fechaFin, true);

        List<com.miapp.model.dto.IntranetVisitaDTO> lista = prestamoService.reporteVisitasBibliotecaIntranet(
                sede,
                tipoUsuario,
                estado,
                escuela,
                programa,
                ciclo,
                inicio,
                fin
        );
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    private static final DateTimeFormatter FORMATO_DD_MM_YYYY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FORMATO_DD_MM_YYYY_GUION = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter FORMATO_LOCALE_GMT =
            DateTimeFormatter.ofPattern("EEE MMM dd yyyy HH:mm:ss 'GMT'XXX", Locale.ENGLISH);
    private static final DateTimeFormatter FORMATO_LOG =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss,SSSSSSSSS");

    private LocalDateTime parseDate(String dateStr, boolean endExclusive) {
        LocalDate baseDate = resolveLocalDate(dateStr);
        if (baseDate == null) {
            return null;
        }
        LocalDateTime start = baseDate.atStartOfDay();
        return endExclusive ? start.plusDays(1) : start;
    }

    private String describirRangoConsulta(LocalDateTime inicio, LocalDateTime finExclusiva) {
        String inicioLegible = formatearFechaLog(inicio);
        if (finExclusiva == null) {
            return inicioLegible + " → sin fecha fin";
        }
        LocalDateTime finInclusivo = finExclusiva;
        if (finExclusiva.isAfter(LocalDateTime.MIN)) {
            finInclusivo = finExclusiva.minusNanos(1);
        }
        return inicioLegible
                + " → "
                + formatearFechaLog(finInclusivo)
                + " (límite exclusivo: "
                + formatearFechaLog(finExclusiva)
                + ')';
    }
    private String formatearFechaLog(LocalDateTime valor) {
        return valor != null ? valor.format(FORMATO_LOG) : "sin fecha";
    }

    private LocalDate resolveLocalDate(String dateStr) {
        if (dateStr == null) {
            return null;
        }
        String trimmed = dateStr.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(trimmed);
        } catch (DateTimeParseException ignored) {
        }
        try {
            return LocalDate.parse(trimmed, FORMATO_DD_MM_YYYY);
        } catch (DateTimeParseException ignored) {
        }
        try {
            return LocalDate.parse(trimmed, FORMATO_DD_MM_YYYY_GUION);
        } catch (DateTimeParseException ignored) {
        }
        if (trimmed.contains("T")) {
            try {
                return OffsetDateTime.parse(trimmed).toLocalDate();
            } catch (DateTimeParseException ignored) {
                try {
                    return LocalDateTime.parse(trimmed).toLocalDate();
                } catch (DateTimeParseException ignored2) {
                    // continúa con los siguientes formatos
                }
            }
        }
        String sanitized = trimmed.contains("(")
                ? trimmed.substring(0, trimmed.indexOf('(')).trim()
                : trimmed;
        try {
            return ZonedDateTime.parse(sanitized, FORMATO_LOCALE_GMT)
                    .withZoneSameInstant(ZoneId.systemDefault())
                    .toLocalDate();
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    /** Reporte de visitantes de biblioteca virtual */
    @GetMapping("/reporte/visitantes-biblioteca-virtual")
    public ResponseEntity<?> reporteVisitantesBibliotecaVirtual(
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin,
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String sede,
            @RequestParam(required = false) Integer tipoUsuario,
            @RequestParam(required = false) String escuela,
            @RequestParam(required = false) String programa,
            @RequestParam(required = false) String ciclo,
            @RequestParam(name = "baseDatos", required = false) Long baseDatos
    ) {
        LocalDateTime inicio = parseDate(fechaInicio, false);
        LocalDateTime finExclusiva = parseDate(fechaFin, true);

        Map<String, Object> filtros = new HashMap<>();
        filtros.put("fechaInicio", inicio);
        filtros.put("fechaFin", finExclusiva);
        filtros.put("codigo", codigo);
        filtros.put("sede", sede);
        filtros.put("tipoUsuario", tipoUsuario);
        filtros.put("escuela", escuela);
        filtros.put("programa", programa);
        filtros.put("ciclo", ciclo);
        filtros.put("baseDatos", baseDatos);
        System.out.println("[Reporte Visitantes Biblioteca Virtual][Backend] Filtros recibidos: " + filtros);
        System.out.println("[Reporte Visitantes Biblioteca Virtual][Backend] Rango consultado (inclusive): "
                + describirRangoConsulta(inicio, finExclusiva));

        try {
            List<com.miapp.model.dto.VisitanteBibliotecaVirtualDTO> lista =
                    prestamoService.reporteVisitantesBibliotecaVirtual(
                            inicio,
                            finExclusiva,
                            codigo,
                            sede,
                            tipoUsuario,
                            escuela,
                            programa,
                            ciclo,
                            baseDatos
                    );
            System.out.println(
                    "[Reporte Visitantes Biblioteca Virtual][Backend] Registros devueltos: "
                            + (lista != null ? lista.size() : 0)
            );
            System.out.println("[Reporte Visitantes Biblioteca Virtual][Backend] Respuesta cruda: " + lista);
            return ResponseEntity.ok(Map.of("status","0","data", lista));
        } catch (RuntimeException ex) {
            System.out.println(
                    "[Reporte Visitantes Biblioteca Virtual][Backend] Error al obtener datos: " + ex.getMessage()
            );
            throw ex;
        }
    }

    /** Reporte agregado por día de visitantes de biblioteca virtual */
    @GetMapping("/reporte/visitantes-biblioteca-virtual/dias")
    public ResponseEntity<?> reporteVisitantesBibliotecaVirtualPorDia(
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        LocalDateTime inicio = parseDate(fechaInicio, false);
        LocalDateTime finExclusiva = parseDate(fechaFin, true);

        List<VisitantesPorDiaDTO> lista = prestamoService.reporteVisitantesBibliotecaVirtualPorDia(inicio, finExclusiva);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }


    @GetMapping("/reporte/uso-tiempo-biblioteca")
    public ResponseEntity<?> reporteUsoTiempoBiblioteca(
            @RequestParam(required = false) String sede,
            @RequestParam(required = false) Integer tipoUsuario,
            @RequestParam(required = false) String ciclo,
            @RequestParam(required = false) String escuela,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        LocalDateTime inicio = fechaInicio != null ? LocalDate.parse(fechaInicio).atStartOfDay() : LocalDateTime.now().minusMonths(1);
        LocalDateTime fin    = fechaFin != null ? LocalDate.parse(fechaFin).atTime(23,59,59) : LocalDateTime.now();

        List<com.miapp.model.dto.EquipoUsoTiempoDTO> lista = prestamoService.reporteUsoTiempoBiblioteca(
                sede,
                tipoUsuario,
                ciclo,
                escuela,
                inicio,
                fin
        );
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }


    /**
     * Lista el historial de préstamos de un equipo determinado. Si se envía una sede,
     * se filtra por dicha sede.
     */
    @GetMapping("/equipos/{equipoId}/detalles")
    public ResponseEntity<?> listarDetallePorEquipo(
            @PathVariable Long equipoId,
            @RequestParam(required = false) Long sedeId
    ) {
        List<DetallePrestamo> lista = prestamoService.listarPrestamosPorEquipo(equipoId, sedeId);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    @GetMapping("/equipos/{equipoId}/proximo-fin")
    public ResponseEntity<?> obtenerProximoFin(@PathVariable Long equipoId) {
        LocalDateTime fecha = prestamoService.obtenerProximoFin(equipoId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "0");
        resp.put("data", fecha);
        return ResponseEntity.ok(resp);
    }

    /** Lista equipos (id, nombre o ip) */
    @GetMapping("/equipos")
    public ResponseEntity<?> listarEquipos(
            @RequestParam(required = false) String search) {
        List<Equipo> lista = equipoService.listar(search);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

}

