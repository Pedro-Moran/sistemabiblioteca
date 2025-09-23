package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IntegracionPersonaDetalleDTO {

    private String campus;
    private String descCampus;
    private String institucion;
    private String gradoAcademico;
    private String descGradoAcademico;
    private String carrera;
    private String descCarrera;
    private String cicloLectivo;
    private String cicloIngreso;
    private String estadoPrograma;
    private String numeroGradoPrograma;
    private String cicloAcademico;
    private String stdntCarNbr;
    private String motAccion;
    private String desProgramaAct;
    private String desMotAct;
    private String strm;
    private String desStrm;
    private String desAcadTerm;
    private String cicloNivel;
    private String ultimoCicloNivel;
    private String ultimoCicloNivelDescripcion;
    private String esIngresante;
    private String esMatriculado;
}