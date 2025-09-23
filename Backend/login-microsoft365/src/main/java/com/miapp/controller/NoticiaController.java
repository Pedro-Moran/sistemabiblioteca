package com.miapp.controller;

import com.miapp.model.dto. CambioEstadoRequest;
import com.miapp.model.dto.NoticiaDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.service.FileStorageService;
import com.miapp.service.NoticiaService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/api/noticias")
@RequiredArgsConstructor
public class NoticiaController {

    private final NoticiaService srv;
    private final FileStorageService fileStorageService;

    @GetMapping("/listar")
    public ResponseDTO<List<NoticiaDTO>> listar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        // fijamos un rango por defecto si no viene
        LocalDateTime s = start != null ? start : LocalDateTime.of(1970,1,1,0,0);
        LocalDateTime e = end   != null ? end   : LocalDateTime.now();
        return new ResponseDTO<>(0, "OK", srv.listarPorFecha(s, e));
    }

    @PostMapping(
            value    = "/registrar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseDTO<Void> registrar(
            @RequestPart("dto") NoticiaDTO dto,
            @RequestPart(name = "imagen", required = false) MultipartFile imagen
    ) {
        if (imagen != null && !imagen.isEmpty()) {
            String filename = fileStorageService.store(imagen);
            dto.setImagenUrl("/uploads/recursos/" + filename);
        }
        srv.guardar(dto, imagen);
        return new ResponseDTO<>(0, "Noticia guardada", null);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseDTO<Void> eliminar(@PathVariable Long id) {
        srv.eliminar(id);
        return new ResponseDTO<>(0, "Noticia eliminada", null);
    }

    @PutMapping("/activo")
    public ResponseDTO<Void> cambiarActivo(@RequestBody CambioEstadoRequest req) {
        // ahora req.getIdnoticia(), req.getEstadoId() y req.getIdUsuario() no serán null
        srv.cambiarEstado(req.getIdnoticia(), req.getEstadoId(), req.getIdUsuario());
        return new ResponseDTO<>(0, "OK",null);
    }

    @Data
    static class ChangeEstadoRequest {
        private Long id;
        private Long estadoId;
    }
}
