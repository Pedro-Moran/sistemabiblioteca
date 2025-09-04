package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Envoltorio estándar para las respuestas de la API.
 * @param <T> Tipo de dato que devuelve (puede ser List<NoticiaDTO>, NoticiaDTO, Void, etc.)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO<T> {
    private int p_status;
    private String message;
    private T data;
}
