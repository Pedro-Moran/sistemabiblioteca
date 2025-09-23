package com.miapp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SolicitudDTO {
    private Long equipoId;
    private Integer tipoUsuario;
    private String codigoUsuario;
    private String codigoSede;
    private String codigoSemestre;
    private String codigoPrograma;
    private String codigoEscuela;
    private String codigoTurno;
    private String codigoCiclo;
    private TipoPrestamo tipoPrestamo;
    // --- nuevas fechas/hora ---
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaInicio;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaFin;

    private String estadoPrograma;
    private String motaccion;
}