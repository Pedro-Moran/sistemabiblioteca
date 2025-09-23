package com.miapp.controller;


import com.miapp.model.Biblioteca;
import com.miapp.model.Ciudad;
import com.miapp.model.dto.*;
import com.miapp.service.CiudadService;
import com.miapp.service.DetalleBibliotecaService;
import com.miapp.service.InformacionAcademicaService;
import com.miapp.service.impl.BibliotecaServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/api/biblioteca")
public class BibliotecaController {

    private final BibliotecaServiceImpl bibliotecaService;
    private final DetalleBibliotecaService detalleService;
    private final CiudadService ciudadService;
    private final InformacionAcademicaService informacionAcademicaService;

    public BibliotecaController(BibliotecaServiceImpl service, CiudadService ciudadService,
                                DetalleBibliotecaService detalleService,
                                InformacionAcademicaService informacionAcademicaService) {
        this.bibliotecaService = service;
        this.ciudadService = ciudadService;
        this.detalleService = detalleService;
        this.informacionAcademicaService = informacionAcademicaService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestPart("dto") BibliotecaDTO dto,
                                      @RequestPart(value = "portada", required = false) MultipartFile portada) {
        Biblioteca saved = bibliotecaService.register(dto, portada);
        BibliotecaDTO resp = bibliotecaService.mapToDto(saved);
        return ResponseEntity.ok(Map.of("status", 0, "data", resp));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestPart("dto") BibliotecaDTO dto,
                                    @RequestPart(value = "portada", required = false) MultipartFile portada) {
        Biblioteca updated = bibliotecaService.update(id, dto, portada);
        BibliotecaDTO resp = bibliotecaService.mapToDto(updated);
        return ResponseEntity.ok(Map.of("status", 0, "data", resp));
    }

    @GetMapping("/list")
    public ResponseEntity<?> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(value = "sedeId", required = false) Long sedeId,
            @RequestParam(value = "tipoMaterialId", required = false) Long tipoMaterialId) {
        Long sede = (sedeId != null && sedeId > 0) ? sedeId : null;
        Long tipo = (tipoMaterialId != null && tipoMaterialId > 0) ? tipoMaterialId : null;
        Page<BibliotecaDTO> result = bibliotecaService
                .listAllPaged(sede, tipo,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id")));
        return ResponseEntity.ok(Map.of("status", 0, "data", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        BibliotecaDTO dto = bibliotecaService.findById(id)
                .map(bibliotecaService::mapToDto)
                .orElseThrow(() -> new RuntimeException("No existe Biblioteca " + id));
        return ResponseEntity.ok(Map.of("status", 0, "data", dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        bibliotecaService.delete(id);
        return ResponseEntity.ok(Map.of("status", 0));
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> deleteBulk(@RequestBody List<Long> ids) {
        bibliotecaService.deleteAll(ids);
        return ResponseEntity.ok(Map.of("status", 0, "message", "Registros eliminados correctamente"));
    }

    @GetMapping("/ciudades")
    public ResponseEntity<?> listCiudades() {
        List<Ciudad> lista = bibliotecaService.listCiudades();
        var dtos = lista.stream().map(c ->
                Map.<String,String>of(
                        "codigoCiudad", c.getCodigoCiudad(),
                        "nombreCiudad", c.getNombreCiudad()
                )
        ).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(value = "tipoMaterial",  required = false) Long   tipoMaterialId,
            @RequestParam(value = "opcion",        required = false) String opcion,
            @RequestParam(value = "valor",         required = false) String valor,
            @RequestParam(value = "soloEnProceso", required = false, defaultValue = "false")
            boolean soloEnProceso,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            Page<BibliotecaDTO> dtos = bibliotecaService
                    .search(tipoMaterialId, opcion, valor, soloEnProceso,
                            PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id")));
            return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
        } catch (Exception ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<?> listDetalles(
            @PathVariable Long id,
            @RequestParam(value="soloEnProceso", defaultValue="true") boolean soloEnProceso
    ) {
        List<DetalleBibliotecaDTO> dtos = bibliotecaService.listDetallesDto(id, soloEnProceso);
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }



    /** Devuelve todas las ciudades */
    @GetMapping("/listciudades")
    public ResponseEntity<List<CiudadDTO>> listAllCiudades() {
        List<CiudadDTO> dtos = ciudadService.listAll()
                .stream()
                .map(c -> new CiudadDTO(
                        c.getCodigoCiudad(),
                        c.getNombreCiudad(),
                        c.getPais().getPaisId()))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /** Devuelve sólo las ciudades de un país */
    @GetMapping("/by-pais")
    public ResponseEntity<List<CiudadDTO>> findByPais(@RequestParam String paisId) {
        List<CiudadDTO> dtos = ciudadService.findByPais(paisId);
        return ResponseEntity.ok(dtos);
    }


    /**
     * Cambia el estado de la cabecera biblioteca
     */
    @PutMapping("/detalles/estado")
    public ResponseEntity<?> cambiarEstadoDetalle(@RequestBody CambioEstadoDetalleRequest req) {
        bibliotecaService.cambiarEstadoDetalleYCabezera(req);
        // devolvemos el mismo formato de p_status que usa el front
        return ResponseEntity.ok(Map.of(
                "p_status", 0,
                "message",  "Estado actualizado con éxito"
        ));
    }

    @PostMapping("/usuarios/informacion-academica")
    public ResponseEntity<?> obtenerInformacionAcademica(@RequestBody InformacionAcademicaRequest request) {
        String correo = request != null ? request.getCorreo() : null;
        List<InformacionAcademicaDetalleDTO> detalles = informacionAcademicaService.obtenerInformacionAcademica(correo);
        return ResponseEntity.ok(Map.of(
                "status", 0,
                "data", detalles
        ));
    }

    @GetMapping("/catalogo")
    public ResponseEntity<?> catalogo(
            @RequestParam(value="valor",       required = false) String valor,
            @RequestParam(value="sedeId",      required = false) Long   sedeId,
            @RequestParam(value="tipoMaterial",required = false) Long   tipoMaterialId,
            @RequestParam(value="opcion",      required = false) String opcion
    ) {
        List<BibliotecaDTO> dtos = bibliotecaService
                .buscarParaCatalogo(valor, sedeId, tipoMaterialId, opcion);

        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }

    @GetMapping("/detalles/reservados")
    public ResponseEntity<?> listDetallesReservados(
            @RequestParam(value = "sede", required = false) Long sedeId,
            @RequestParam(value = "tipo", required = false) String tipoPrestamo
    ) {
        List<DetalleBibliotecaDTO> dtos = detalleService.findDetallesReservados(sedeId, tipoPrestamo);
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }

    @GetMapping("/reservados")
    public ResponseEntity<?> listReservados() {
        List<BibliotecaDTO> dtos = bibliotecaService.findReservados();
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }



    /** Lista los ejemplares prestados filtrando por los parámetros indicados */
    @GetMapping("/prestados")
    public ResponseEntity<?> listPrestados(
            @RequestParam(value = "fechaPrestamoInicio", required = false) String fechaInicio,
            @RequestParam(value = "fechaPrestamoFin",    required = false) String fechaFin,
            @RequestParam(value = "sede",                required = false) Long sedeId,
            @RequestParam(value = "tipoUsuario",         required = false) Long tipoUsuarioId,
            @RequestParam(value = "estado",              required = false) String tipoPrestamo,
            @RequestParam(value = "especialidad",        required = false) Long especialidadId,
            @RequestParam(value = "programa",            required = false) Long programaId,
            @RequestParam(value = "ciclo",               required = false) String ciclo) {

        List<DetalleBibliotecaDTO> dtos = detalleService.findDetallesPrestados(
                fechaInicio,
                fechaFin,
                sedeId,
                tipoUsuarioId,
                tipoPrestamo,
                especialidadId,
                programaId,
                ciclo
        );
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }


    /** Marca un detalle como devuelto sin notificación */
    @PostMapping("/detalles/devolver")
    public ResponseEntity<?> devolverDetalle(
            @RequestBody Map<String, Object> payload,
            Authentication auth
    ) {
        Long id = Long.valueOf(payload.get("idDetalleBiblioteca").toString());
        bibliotecaService.devolverDetalle(id, auth.getName());
        return ResponseEntity.ok(Map.of("status", 0));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<?> listDisponibles() {
        List<BibliotecaDTO> dtos = bibliotecaService.findDisponibles();
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }

    /** Lista disponibles filtrando por tipo de material */
    @GetMapping("/disponibles-by-tipo")
    public ResponseEntity<?> listDisponiblesByTipo(@RequestParam Long tipoMaterial) {
        List<BibliotecaDTO> dtos = bibliotecaService.findDisponiblesPorTipoMaterial(tipoMaterial);
        return ResponseEntity.ok(Map.of("status", 0, "data", dtos));
    }

    @GetMapping("/detalles/{id}")
    public ResponseEntity<DetalleBibliotecaDTO> getDetalleById(@PathVariable Long id) {
        DetalleBibliotecaDTO dto = detalleService.findById(id);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/detalles/numero-ingreso/{numero}")
    public ResponseEntity<DetalleBibliotecaDTO> getDetalleByNumeroIngreso(@PathVariable("numero") Long numeroIngreso) {
        DetalleBibliotecaDTO dto = detalleService.findByNumeroIngreso(numeroIngreso);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    /** Endpoint para obtener todos los detalles reservados (con su “biblioteca” anidada) */
    @GetMapping("/detalles-reservados")
    public ResponseEntity<Map<String, Object>> getDetallesReservados() {
        List<DetalleBibliotecaDTO> lista = bibliotecaService.listarTodosDetallesReservados();
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", 0);
        resp.put("data", lista);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/reporte/ejemplar-mas-prestado")
    public ResponseEntity<?> reporteEjemplarMasPrestado(@RequestParam(required = false) Long sede,
                                                        @RequestParam(required = false) Long tipoMaterial,
                                                        @RequestParam(required = false) Long especialidad,
                                                        @RequestParam(required = false) Integer ciclo,
                                                        @RequestParam(required = false) Long numeroIngreso,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate fechaInicio,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate fechaFin) {
        return ResponseEntity.ok(Map.of("status", 0, "data",
                bibliotecaService.reporteEjemplarMasPrestado(
                        sede,
                        tipoMaterial,
                        especialidad,
                        ciclo,
                        numeroIngreso,
                        fechaInicio,
                        fechaFin)));
    }

    @GetMapping("/reporte/ejemplar-no-prestados")
    public ResponseEntity<?> reporteEjemplarNoPrestado(@RequestParam(required = false) Long sede,
                                                       @RequestParam(required = false) Long tipoMaterial,
                                                       @RequestParam(required = false) Long especialidad,
                                                       @RequestParam(required = false) Integer ciclo,
                                                       @RequestParam(required = false) Long numeroIngreso,
                                                       @RequestParam(required = false)
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                       java.time.LocalDate fechaInicio,
                                                       @RequestParam(required = false)
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                       java.time.LocalDate fechaFin) {
        return ResponseEntity.ok(Map.of("status", 0, "data",
                bibliotecaService.reporteEjemplarNoPrestado(
                        sede,
                        tipoMaterial,
                        especialidad,
                        ciclo,
                        numeroIngreso,
                        fechaInicio,
                        fechaFin)));
    }

}


