package com.miapp.controller;

import com.miapp.model.Equipo;
import com.miapp.model.Estado;
import com.miapp.model.Sede;
import com.miapp.service.EquipoService;
import com.miapp.service.EstadoService;
import com.miapp.service.SedeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;
    private final EstadoService estadoService;
    private final SedeService sedeService;


    public EquipoController(EquipoService equipoService, EstadoService estadoService, SedeService sedeService) {
        this.equipoService = equipoService;
        this.estadoService = estadoService;
        this.sedeService = sedeService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> crearEquipo(@RequestBody Equipo equipo) {
        try {
            Equipo creado = equipoService.crearEquipo(equipo);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Equipo creado exitosamente", "data", creado));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> actualizarEquipo(@PathVariable Long id, @RequestBody Equipo equipo) {
        try {
            Equipo actualizado = equipoService.actualizarEquipo(id, equipo);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Equipo actualizado exitosamente", "data", actualizado));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> eliminarEquipo(@PathVariable Long id) {
        try {
            equipoService.eliminarEquipo(id);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Equipo eliminado correctamente."));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> eliminarEquipos(@RequestBody List<Long> ids) {
        equipoService.eliminarEquipos(ids);
        return ResponseEntity.ok(Map.of("status", 0, "message", "Registros eliminados correctamente"));
    }

    @GetMapping("/list")
    public ResponseEntity<?> listarEquipos(@RequestParam(required = false) Boolean discapacidad) {
        List<Equipo> lista = equipoService.listarEquipos(discapacidad);
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filtrarPorSede(@RequestParam Long sedeId, @RequestParam(required = false) Boolean discapacidad) {
        List<Equipo> lista = equipoService.filtrarPorSedeExcluyendoEnProceso(sedeId, discapacidad);
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    @PutMapping("/changeState/{id}")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            Equipo actualizado = equipoService.cambiarEstado(id, estado);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Estado actualizado correctamente", "data", actualizado));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerEquipo(@PathVariable Long id) {
        Optional<Equipo> equipo = equipoService.obtenerEquipo(id);
        return equipo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sedes")
    public ResponseEntity<?> listarSedes() {
        try {
            List<Sede> sedes = sedeService.getSedesActivas();
            return ResponseEntity.ok(Map.of("status", 0, "data", sedes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    @GetMapping("/estados")
    public ResponseEntity<?> listarEstados() {
        try {
            List<Estado> estados = estadoService.getEstados();
            return ResponseEntity.ok(Map.of("status", 0, "data", estados));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    // Endpoint que lista equipos sin el estado "EN PROCESO"
    @GetMapping("/listWithoutEnProceso")
    public ResponseEntity<?> listWithoutEnProceso(@RequestParam(required = false) Boolean discapacidad) {
        List<Equipo> lista = equipoService.listWithoutEnProceso(discapacidad);
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    // Endpoint que lista solo los equipos con el estado "EN PROCESO"
    @GetMapping("/listEnProceso")
    public ResponseEntity<?> listEnProceso() {
        List<Equipo> lista = equipoService.listEnProceso();
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    // Endpoint para obtener equipos de una sede que estén en "EN PROCESO"
    @GetMapping("/filter/onlyEnProceso")
    public ResponseEntity<?> filtrarSoloEnProceso(@RequestParam Long sedeId) {
        List<Equipo> lista = equipoService.filtrarSoloEnProceso(sedeId);
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    @GetMapping("/exists")
    public ResponseEntity<?> existeIp(@RequestParam String ip, @RequestParam(required = false) Long id) {
        boolean exists = equipoService.existeIp(ip, id);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/validar-bloqueo")
    public ResponseEntity<?> validarBloqueo(@RequestParam String ip) {
        try {
            int estadoPrestamo = equipoService.validarBloqueo(ip);
            boolean requiereBloqueo = estadoPrestamo == 3 || estadoPrestamo == 4 || estadoPrestamo == 9;
            return ResponseEntity.ok(Map.of(
                    "status", 0,
                    "estadoPrestamo", estadoPrestamo,
                    "requiereBloqueo", requiereBloqueo
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", -1,
                            "message", ex.getMessage()
                    ));
        }
    }

    @PostMapping("/inactivar-por-ip")
    public ResponseEntity<?> inactivarPorIp(@RequestParam String ip) {
        try {
            boolean actualizado = equipoService.inactivarEquipoPorIp(ip);
            String message = actualizado
                    ? "Equipo inactivado correctamente"
                    : "No se encontraron registros activos para el equipo";
            return ResponseEntity.ok(Map.of(
                    "status", 0,
                    "message", message,
                    "actualizado", actualizado
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", -1,
                            "message", ex.getMessage()
                    ));
        }
    }


}