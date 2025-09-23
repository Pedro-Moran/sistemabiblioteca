package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la estadística de préstamos aprobados por usuario.
 * Agrupa todos los préstamos aprobados sin distinguir el equipo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEquipoPrestamosDTO {
    private Long id;
    private String usuario;
    private String sede;
    private Long totalPrestamos;
}