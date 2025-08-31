package com.miapp.controller;

import com.miapp.model.TipoMaterial;
import com.miapp.service.TipoMaterialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/api/catalogos")
public class CatalogoController {

    private final TipoMaterialService tipoMaterialService;

    public CatalogoController(TipoMaterialService tipoMaterialService) {
        this.tipoMaterialService = tipoMaterialService;
    }

    // Endpoint para listar todos los tipos de material
    @GetMapping("/tipomaterial")
    public ResponseEntity<List<TipoMaterial>> listarTipoMaterial() {
        List<TipoMaterial> lista = tipoMaterialService.listAll();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/tipomaterial/activos")
    public ResponseEntity<?> listarTipoMaterialActivos() {
        List<TipoMaterial> lista = tipoMaterialService.listActivos();

        // Mapea cada TipoMaterial a un mapa con la estructura esperada por el frontend.
        List<Map<String, Object>> listaMapeada = lista.stream().map(tipo -> {
            Map<String, Object> mapeo = new HashMap<>();
            // Se crea el objeto anidado "tipo" con la propiedad "id"
            Map<String, Object> innerTipo = new HashMap<>();
            innerTipo.put("id", tipo.getIdTipoMaterial());
            // Puedes también incluir más propiedades anidadas si lo requieres
            mapeo.put("tipo", innerTipo);
            // Agrega las otras propiedades que el front quizá espera
            mapeo.put("descripcion", tipo.getDescripcion());
            mapeo.put("activo", tipo.getActivo());
            return mapeo;
        }).toList();

        return ResponseEntity.ok(Map.of("status", "0", "data", listaMapeada));
    }

}
