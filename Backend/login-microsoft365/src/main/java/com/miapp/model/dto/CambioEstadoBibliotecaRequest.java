package com.miapp.model.dto;

import lombok.Data;

@Data
public class CambioEstadoBibliotecaRequest {
    private Long id;          // id de la biblioteca (cabecera)
    private Long idEstado;
    private String usuarioModificacion;
}