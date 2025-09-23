package com.miapp.model.dto;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para exponer el total de ingresos y usuarios únicos por día en la biblioteca virtual.
 */
@Getter
public class VisitantesPorDiaDTO {

    private final LocalDate fecha;
    private final long ingresos;
    private final long usuariosUnicos;

    public VisitantesPorDiaDTO(LocalDateTime fecha, Long ingresos, Long usuariosUnicos) {
        this(fecha != null ? fecha.toLocalDate() : null, ingresos, usuariosUnicos);
    }

    public VisitantesPorDiaDTO(LocalDate fecha, Long ingresos, Long usuariosUnicos) {
        this.fecha = fecha;
        this.ingresos = ingresos != null ? ingresos : 0L;
        this.usuariosUnicos = usuariosUnicos != null ? usuariosUnicos : 0L;
    }
}