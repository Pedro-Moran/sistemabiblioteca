package com.miapp.model.dto;

import lombok.Data;

@Data
public class ActualizarInventarioRequest {
    private Long detalleId;
    private Long idDetalleBiblioteca;
    private Long detalleBibliotecaId;
    private String codigoBarra;
    private String estadoInventario;
    private String codigoLocalizacion;

    public Long resolveDetalleId() {
        if (detalleId != null) {
            return detalleId;
        }
        if (idDetalleBiblioteca != null) {
            return idDetalleBiblioteca;
        }
        return detalleBibliotecaId;
    }
}