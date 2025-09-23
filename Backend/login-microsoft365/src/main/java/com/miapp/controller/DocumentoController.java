package com.miapp.controller;

import com.miapp.service.external.DocumentoLookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/api/documento")
public class DocumentoController {
    private final DocumentoLookupService documentoLookupService;

    public DocumentoController(DocumentoLookupService documentoLookupService) {
        this.documentoLookupService = documentoLookupService;
    }

    @GetMapping("/consultar/{tipo}/{numero}")
    public ResponseEntity<?> consultar(@PathVariable String tipo, @PathVariable String numero) {
        Map<String, Object> data = documentoLookupService.consultar(tipo, numero);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }
}