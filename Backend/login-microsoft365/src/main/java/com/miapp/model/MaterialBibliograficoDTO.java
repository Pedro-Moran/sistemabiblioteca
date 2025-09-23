package com.miapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialBibliograficoDTO {
    private MaterialDTO informacionLibro;
    private EditorialDTO informacionEditorial;
    private DetalleDTO detalle;
}
