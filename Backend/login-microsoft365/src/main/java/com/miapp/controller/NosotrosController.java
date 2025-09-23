package com.miapp.controller;

import com.miapp.model.dto.NosotrosDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.service.FileStorageService;
import com.miapp.service.NosotrosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth/api/nosotros")
@RequiredArgsConstructor
public class NosotrosController {

    private final NosotrosService srv;
    private final FileStorageService fileStorageService;

    @GetMapping
    public NosotrosDTO get() {
        return srv.load();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseDTO<Void> save(
            @RequestPart("dto") NosotrosDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) {
        if (imagen != null && !imagen.isEmpty()) {
            if (!"image/png".equals(imagen.getContentType())) {
                throw new RuntimeException("Solo se permiten imágenes PNG");
            }
            if (imagen.getSize() > 8 * 1024 * 1024) {
                throw new RuntimeException("La imagen supera los 8MB");
            }
            String filename = fileStorageService.store(imagen);
            dto.setImageUrl("/uploads/recursos/" + filename);
        }
        srv.save(dto);
        return new ResponseDTO<>(0, "Guardado", null);
    }
}
