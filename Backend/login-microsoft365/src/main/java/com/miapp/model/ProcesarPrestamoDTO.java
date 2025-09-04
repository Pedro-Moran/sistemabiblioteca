package com.miapp.model;

import lombok.Data;

@Data
public class ProcesarPrestamoDTO {
    private Long id;
    private Boolean aprobar;
    // si en el futuro quisieras cambiar tipo de préstamo al aprobar, aquí podrías añadir:
    // private String tipoPrestamo;
}