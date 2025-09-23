package com.miapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.miapp.model.dto.DashboardIncomeDTO;
import com.miapp.model.dto.DashboardRecursoDTO;
import com.miapp.model.dto.DashboardStatsDTO;
import com.miapp.service.DashboardMetricsService;

@RestController
@RequestMapping("/auth/api/dashboard")
public class DashboardController {

    private final DashboardMetricsService dashboardMetricsService;

    public DashboardController(DashboardMetricsService dashboardMetricsService) {
        this.dashboardMetricsService = dashboardMetricsService;
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        DashboardStatsDTO stats = dashboardMetricsService.obtenerEstadisticas();
        return ResponseEntity.ok(Map.of(
                "status", 0,
                "data", stats));
    }

    @GetMapping("/ingresos")
    public ResponseEntity<Map<String, Object>> obtenerIngresos(
            @RequestParam(name = "meses", required = false) Integer meses) {
        int cantidadMeses = meses != null ? meses : 6;
        DashboardIncomeDTO ingresos = dashboardMetricsService.obtenerIngresosMensuales(cantidadMeses);
        return ResponseEntity.ok(Map.of(
                "status", 0,
                "data", ingresos));
    }

    @GetMapping("/recientes")
    public ResponseEntity<Map<String, Object>> obtenerRecientes(
            @RequestParam(name = "limite", required = false) Integer limite) {
        int cantidad = limite != null ? limite : 5;
        List<DashboardRecursoDTO> recursos = dashboardMetricsService.obtenerRecursosRecientes(cantidad);
        return ResponseEntity.ok(Map.of(
                "status", 0,
                "data", recursos));
    }
}