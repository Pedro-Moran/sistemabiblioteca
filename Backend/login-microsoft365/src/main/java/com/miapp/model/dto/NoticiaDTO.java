package com.miapp.model.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class NoticiaDTO {
    private Long idnoticia;
    private String titular;
    private String subtitulo;
    private String autor;
    private String descripcion;
    private String enlace;
    private String imagenUrl;
    private Long estadoId;
    private String estadoDescripcion;
    private String usuariocreacion;
    private String usuariomodificacion;
    private LocalDateTime fechacreacion;
    private LocalDateTime fechamodificacion;
}
