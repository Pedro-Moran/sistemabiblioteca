package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para el reporte de uso de equipos de biblioteca virtual */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipoUsoTiempoDTO {
    private String sede;
    private String nombreEquipo;
    private String numeroEquipo;
    private Long   cantidadPrestamos;
    private Double horasPrestado;
}