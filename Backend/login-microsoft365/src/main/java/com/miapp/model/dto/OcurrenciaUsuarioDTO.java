package com.miapp.model.dto;

public record OcurrenciaUsuarioDTO(
        Long id,
        String codigoUsuario,
        Integer tipoUsuario,
        Long idUsuario,
        String nombres,
        String apellidoPaterno,
        String apellidoMaterno
) {}