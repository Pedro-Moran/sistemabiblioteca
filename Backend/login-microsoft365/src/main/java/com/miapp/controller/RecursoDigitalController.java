package com.miapp.controller;

import com.miapp.model.dto.RecursoDigitalDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.service.FileStorageService;
import com.miapp.service.RecursoDigitalService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/auth/api/recursos-digitales")
@RequiredArgsConstructor
public class RecursoDigitalController {
    private final RecursoDigitalService srv;
    private final FileStorageService fileStorageService;

    @GetMapping("/listar")
    public ResponseDTO<List<RecursoDigitalDTO>> listar() {
        return new ResponseDTO<>(0, "OK", srv.listar());
    }

    @GetMapping("/listar/tipo/{tipoId}")
    public ResponseDTO<List<RecursoDigitalDTO>> listarPorTipo(@PathVariable Long tipoId) {
        return new ResponseDTO<>(0, "OK", srv.listarPorTipo(tipoId));
    }

    @GetMapping("/enlace/{id}")
    public ResponseDTO<String> obtenerEnlace(@PathVariable Long id) {
        return new ResponseDTO<>(0, "OK", srv.obtenerEnlace(id));
    }

    @PostMapping(
            value = "/registrar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseDTO<Void> registrar(
            @RequestPart("dto") RecursoDigitalDTO dto,
            @RequestPart(name="imagen", required=false) MultipartFile imagen
    ) {
        String filename = null;
        if (imagen != null && !imagen.isEmpty()) {
            // almacena el fichero
            filename = fileStorageService.store(imagen);
            // guarda la URL pública en el DTO
            dto.setImagenUrl("/uploads/recursos/" + filename);
        }
        srv.guardar(dto, imagen);
        return new ResponseDTO<>(0, "RECURSO GUARDADO", null);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseDTO<Void> eliminar(@PathVariable Long id) {
        srv.eliminar(id);
        return new ResponseDTO<>(0, "RECURSO ELIMINADO", null);
    }

    @PostMapping("/delete-bulk")
    public ResponseDTO<Void> eliminarVarios(@RequestBody List<Long> ids) {
        srv.deleteAll(ids);
        return new ResponseDTO<>(0, "RECURSOS ELIMINADOS", null);
    }

    @PutMapping("/activo")
    public ResponseDTO<Void> cambiarEstado(@RequestBody CambioEstadoRequest r) {
        srv.cambiarEstado(r.getId(), r.getNuevoEstado(), r.getUsuario());
        return new ResponseDTO<>(0, "ESTADO CAMBIADO", null);
    }

    @Data
    static class CambioEstadoRequest {
        private Long id;
        private Integer nuevoEstado;
        private String usuario;
    }
}
