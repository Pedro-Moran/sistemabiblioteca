package com.miapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleDTO {
    private Long sedeId;
    private TipoMaterialDTO tipoMaterial;
    private Long tipoAdquisicionId;
    private String fechaIngreso; // podrías recibirlo como String para luego convertirlo a Date
    private Double costo;
    private String numeroFactura;
    private String portadaLibroImg; // URL de la imagen
}
