package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que expone los perfiles configurados en la base de datos que coinciden
 * con los grupos devueltos por Microsoft Graph para un usuario determinado.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PerfilMicrosoftDTO {

    private String graphGroupId;

    private String nombre;

    private Long rolId;

    private String rolDescripcion;

    private GraphGroupDTO graphGroup;
}