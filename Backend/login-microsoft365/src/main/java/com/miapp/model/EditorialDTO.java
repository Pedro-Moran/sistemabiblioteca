package com.miapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditorialDTO {
    private String autorPersonal;
    private String autorSecundario;
    private String autorInstitucional;
    private String editorial;
    private String coordinador;
    private String director;
    private String compilador;
    private Long paisId;
    private Long ciudadId;
    private Long idiomaId;
    private String serie;
    private Long descripcionFisicaId; // se relaciona con la tabla de descripción física
    private Integer cantidad;
    private Integer anioPublicacion;
    private String edicion;
    private String reimpresion;
    private String isbn;
}
