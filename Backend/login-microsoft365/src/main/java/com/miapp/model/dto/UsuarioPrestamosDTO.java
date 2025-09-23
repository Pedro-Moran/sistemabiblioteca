package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para la estadística de préstamos por usuario */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioPrestamosDTO {
    /** Identificador del último préstamo del usuario */
    private Long id;
    private String usuario;
    private String sede;
    private Long totalPrestamos;
}