package com.miapp.model.dto;

import lombok.Data;

@Data
public class CambioEstadoRequest {
    private Long idnoticia;     // que coincida con el nombre que envías desde el cliente
    private Long estadoId;      // el nuevo IDESTADO
    private String idUsuario;     // para rellenar usuariomodificacion
}