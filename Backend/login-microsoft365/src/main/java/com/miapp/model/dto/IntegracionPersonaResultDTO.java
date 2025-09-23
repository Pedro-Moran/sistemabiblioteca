package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IntegracionPersonaResultDTO {

    private String resultado;

    @JsonProperty("emplID")
    private String emplId;

    private String apellidoPaterno;

    private String apellidoMaterno;

    private String nombre;

    private String sexo;

    @JsonProperty("nacionalidadId")
    private String nacionalidadId;

    @JsonProperty("nacionalidadIdTipo")
    private String nacionalidadIdTipo;

    @JsonProperty("nacionalidadTipo")
    private String nacionalidadTipo;

    private String correo;

    private String fechaNacimiento;

    private String estadoCivil;

    private List<IntegracionPersonaDetalleDTO> detalleInformacionAcademica;
}