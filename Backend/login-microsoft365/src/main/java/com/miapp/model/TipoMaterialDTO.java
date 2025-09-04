package com.miapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoMaterialDTO {
    private Long idTipoMaterial;
    private String descripcion;
    private Boolean activo;
}
