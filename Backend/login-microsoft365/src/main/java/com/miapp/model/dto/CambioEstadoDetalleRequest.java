package com.miapp.model.dto;

import lombok.Data;

@Data
public class CambioEstadoDetalleRequest {
    private Long idDetalleBiblioteca;
    private Long idEstado;
    private String idUsuario;
    private String tipoPrestamo;
    private String codigoPrograma;
    private String codigoEspecialidad;
    private String codigoCiclo;
    private String estadoPrograma;
    private String motaccion;
}