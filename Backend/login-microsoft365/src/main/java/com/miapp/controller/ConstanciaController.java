package com.miapp.controller;

import com.miapp.model.dto.ConstanciaBusquedaDTO;
import com.miapp.service.ConstanciaService;
import com.miapp.model.dto.ConstanciaPrintRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.io.IOException;

@RestController
@RequestMapping("/auth/api/constancias")
@RequiredArgsConstructor
public class ConstanciaController {

    private final ConstanciaService constanciaService;

    @GetMapping("/usuario/{codigo}")
    public ResponseEntity<?> estadoUsuario(@PathVariable String codigo) {
        boolean pendiente = constanciaService.tienePendientes(codigo);
        return ResponseEntity.ok(Map.of("status", 0, "data", Map.of("pendiente", pendiente)));
    }

    @GetMapping("/search")
    public ResponseEntity<?> buscar(@RequestParam(value = "q", required = false) String q) {
        List<ConstanciaBusquedaDTO> lista = constanciaService.buscar(q);
        return ResponseEntity.ok(Map.of("status", 0, "data", lista));
    }

    @GetMapping("/preview/{codigo}")
    public ResponseEntity<byte[]> preview(@PathVariable String codigo) throws IOException {
        byte[] pdf = constanciaService.previsualizarPdf(codigo);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=preview.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> imprimir(@RequestBody ConstanciaPrintRequest request) throws IOException {
        byte[] pdf = constanciaService.generarConstanciaPdf(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=constancia.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}