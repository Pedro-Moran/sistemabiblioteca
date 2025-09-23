package com.miapp.model.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardRecursoDTO {
    private Long id;
    private String nombre;
    private BigDecimal precio;
    private String imagen;
}