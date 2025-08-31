package com.miapp.model.dto;

import lombok.Data;

@Data
public class CambioEstadoDetalleRequest {
    private Long idDetalleBiblioteca;
    private Long idEstado;
    private String idUsuario;
}
