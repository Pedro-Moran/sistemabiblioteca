package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InformacionAcademicaDetalleDTO {
    private String gradoAcademico;
    private String carrera;
    private String cicloNivel;
    private String descripcionGradoAcademico;
    private String descripcionCarrera;
    private String descripcionCicloNivel;
}