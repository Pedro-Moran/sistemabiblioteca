package com.miapp.model.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecursoDigitalDTO {
    private Long id;
    private String autor;
    private Long tipoId;
    private String tipoDescripcion;
    private String titulo;
    private String descripcion;
    private String enlace;
    private Integer estado;
    private String usuarioCreacion;
    private String usuarioModificacion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String imagenUrl; // base64 o ruta
    private Long clicks;
}

