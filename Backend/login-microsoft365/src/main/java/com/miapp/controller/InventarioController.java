package com.miapp.controller;

import com.miapp.model.dto.ActualizarInventarioRequest;
import com.miapp.model.dto.InventarioItemDTO;
import com.miapp.service.InventarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/api/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping("/material")
    public ResponseEntity<Map<String, Object>> buscarPorCodigo(@RequestParam("codigoBarra") String codigoBarra) {
        List<InventarioItemDTO> data = inventarioService.buscarMateriales(codigoBarra);
        return ResponseEntity.ok(Map.of(
                "status", 0,
                "data", data
        ));
    }

    @PutMapping("/material/verificacion")
    public ResponseEntity<Map<String, Object>> actualizarEstado(
            @RequestBody ActualizarInventarioRequest request,
            Authentication authentication
    ) {
        String usuario = authentication != null ? authentication.getName() : null;
        InventarioItemDTO actualizado = inventarioService.actualizarEstado(request, usuario);
        return ResponseEntity.ok(Map.of(
                "status", 0,
                "data", actualizado
        ));
    }
}