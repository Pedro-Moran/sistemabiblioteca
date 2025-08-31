package com.miapp.controller;

import com.miapp.model.*;
import com.miapp.model.dto.OcurrenciaBibliotecaDTO;
import com.miapp.model.dto.UsuarioPrestamosDTO;
import com.miapp.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/api/prestamos")
@RequiredArgsConstructor
public class PrestamoController {

    private final PrestamoService prestamoService;
    private final NotificacionService notificacionService;
    private final OcurrenciaBibliotecaService ocurrenciaBibliotecaService;
    private final UsuarioService usuarioService;
    private final EquipoService equipoService;

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
                usuario
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
            @RequestParam(required = false) String search) {
        List<Usuario> lista = usuarioService.listar(search);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    @GetMapping("/reporte/estudiantes-atendidos")
    public ResponseEntity<?> reporteEstudiantesAtendidos() {
        List<com.miapp.model.dto.UsuarioPrestamosDTO> lista = prestamoService.reporteEstudiantesAtendidos();
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    @GetMapping("/reporte/usuarios-atendidos-biblioteca")
    public ResponseEntity<?> reporteUsuariosAtendidosBiblioteca() {
        List<com.miapp.model.dto.UsuarioEquipoPrestamosDTO> lista = prestamoService.reporteUsuariosAtendidosBiblioteca();
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    /** Reporte de visitantes de biblioteca virtual */
    @GetMapping("/reporte/visitantes-biblioteca-virtual")
    public ResponseEntity<?> reporteVisitantesBibliotecaVirtual() {
        List<com.miapp.model.dto.VisitanteBibliotecaVirtualDTO> lista = prestamoService.reporteVisitantesBibliotecaVirtual();
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }


    @GetMapping("/reporte/uso-tiempo-biblioteca")
    public ResponseEntity<?> reporteUsoTiempoBiblioteca(
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        LocalDateTime inicio = fechaInicio != null ? LocalDate.parse(fechaInicio).atStartOfDay() : LocalDateTime.now().minusMonths(1);
        LocalDateTime fin    = fechaFin != null ? LocalDate.parse(fechaFin).atTime(23,59,59) : LocalDateTime.now();

        List<com.miapp.model.dto.EquipoUsoTiempoDTO> lista = prestamoService.reporteUsoTiempoBiblioteca(inicio, fin);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

    /** Lista equipos (id, nombre o ip) */
    @GetMapping("/equipos")
    public ResponseEntity<?> listarEquipos(
            @RequestParam(required = false) String search) {
        List<Equipo> lista = equipoService.listar(search);
        return ResponseEntity.ok(Map.of("status","0","data", lista));
    }

}

