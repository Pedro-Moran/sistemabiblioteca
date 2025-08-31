package com.miapp.model.dto;

import lombok.Data;

@Data
public class ConstanciaPrintRequest {
    private String codigo;
    private String estudiante;
    private Integer tipoConstancia;
    private String sede;
    private String correlativo;
    private String descripcion;
}