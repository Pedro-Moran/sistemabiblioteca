package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventarioItemDTO {
    private Long id;
    private Long idDetalleBiblioteca;
    private String codigoBarra;
    private String codigoLocalizacion;
    private String titulo;
    private String autor;
    private String estadoInventario;
    private LocalDateTime fechaVerificacion;
    private String usuarioVerificacion;
}