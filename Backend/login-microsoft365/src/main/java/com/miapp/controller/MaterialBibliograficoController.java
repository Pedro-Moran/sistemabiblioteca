package com.miapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miapp.model.*;
import com.miapp.model.dto.CiudadDTO;
import com.miapp.service.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/api/material-bibliografico")
public class MaterialBibliograficoController {

    private final MaterialBibliograficoService service;
    private final EspecialidadService especialidadService;
    private final PaisService paisService;
    private final IdiomaService idiomaService;
    private final CiudadService ciudadService;
    private final TipoAdquisicionService tipoAdquisicionService;
    private final PeriodicidadService periodicidadService;

    public MaterialBibliograficoController(MaterialBibliograficoService service,
                                           EspecialidadService especialidadService,
                                           PaisService paisService,
                                           IdiomaService idiomaService,
                                           CiudadService ciudadService,
                                           TipoAdquisicionService tipoAdquisicionService,
                                           PeriodicidadService periodicidadService) {
        this.service = service;
        this.especialidadService = especialidadService;
        this.paisService = paisService;
        this.idiomaService = idiomaService;
        this.ciudadService = ciudadService;
        this.tipoAdquisicionService = tipoAdquisicionService;
        this.periodicidadService = periodicidadService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerMaterial(
            @RequestPart("dto") MaterialBibliograficoDTO dto,
            @RequestPart(value = "portada", required = false) MultipartFile portada) {
        try {
            MaterialBibliografico savedMaterial = service.registerMaterial(dto, portada);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Material registrado exitosamente", "data", savedMaterial));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMaterial(@PathVariable Long id,
                                            @RequestPart("dto") MaterialBibliograficoDTO dto,
                                            @RequestPart(value = "portada", required = false) MultipartFile portada) {
        try {
            MaterialBibliografico updatedMaterial = service.updateMaterial(id, dto, portada);
            return ResponseEntity.ok(Map.of("status", 0, "message", "Material actualizado exitosamente", "data", updatedMaterial));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", ex.getMessage()));
        }
    }


    // Endpoint de eliminación
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(Map.of("p_status", 0, "p_message", "Material eliminado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", -1, "message", e.getMessage()));
        }
    }

    // Endpoint para obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(material -> ResponseEntity.ok(material))
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para listar todos los registros
    @GetMapping("/list")
    public ResponseEntity<?> listAll() {
        List<MaterialBibliografico> lista = service.listAll();
        return ResponseEntity.ok(Map.of("status", "0", "data", lista));
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchMaterial(
            @RequestParam(value = "tipoMaterial", required = false) Integer tipoMaterialId,
            @RequestParam(value = "opcion", required = false) String opcion,
            @RequestParam(value = "valor", required = false) String valor) {

        try {
            List<MaterialBibliografico> result = service.search(tipoMaterialId, opcion, valor);
            return ResponseEntity.ok(Map.of("status", "0", "data", result));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "-1", "message", ex.getMessage()));
        }
    }

    // Endpoint para búsqueda filtrando por sede.
    @GetMapping("/searchbysede")
    public ResponseEntity<?> searchBySede(
            @RequestParam(value = "sedeId", required = false) Long sedeId,
            @RequestParam(value = "opcion", required = false) String opcion,
            @RequestParam(value = "valor", required = false) String valor) {

        try {
            // Se invoca un método en el servicio que filtre por sede.
            List<MaterialBibliografico> result = service.searchBySede(sedeId, opcion, valor);
            return ResponseEntity.ok(Map.of("status", "0", "data", result));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "-1", "message", ex.getMessage()));
        }
    }

    @GetMapping("/especialidad")
    public ResponseEntity<?> EspecialidadActivos() {
        try {
            List<Especialidad> lista = especialidadService.getActivos();
            System.out.println(lista);
            return ResponseEntity.ok(Map.of("status", "0", "data", lista));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "1", "mensaje", "Error al obtener especialidad"));
        }
    }

    @GetMapping("/pais")
    public ResponseEntity<?> Paises() {
        List<Pais> all = paisService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", all));
    }

    @GetMapping("/idioma")
    public ResponseEntity<?> Idiomas() {
        List<Idioma> all = idiomaService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", all));
    }

    @GetMapping("/adquisicion")
    public ResponseEntity<?> Adquiscion() {
        List<TipoAdquisicion> all = tipoAdquisicionService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", all));
    }

    @GetMapping("/periodicidad")
    public ResponseEntity<?> listarPeriodicidad() {
        List<Periodicidad> all = periodicidadService.listAll();
        return ResponseEntity.ok(Map.of("status", 0, "data", all));
    }

    @GetMapping("/ciudad-by-pais/{codigoPais}")
    public ResponseEntity<?> byPais(@PathVariable String codigoPais) {
        List<CiudadDTO> list = ciudadService.findByPais(codigoPais);
        return ResponseEntity.ok(Map.of("status", 0, "data", list));
    }


}
