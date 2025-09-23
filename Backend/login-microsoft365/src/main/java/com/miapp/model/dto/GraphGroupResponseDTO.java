package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Respuesta estándar de Microsoft Graph para la consulta de grupos transitivos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GraphGroupResponseDTO {

    @JsonProperty("@odata.context")
    private String context;

    @JsonProperty("@odata.count")
    private Integer count;

    private List<GraphGroupDTO> value = new ArrayList<>();
}