package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

/**
 * Resultado compuesto que agrupa la información proveniente de Microsoft Graph
 * junto con los perfiles configurados localmente para simplificar el consumo en
 * el frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MicrosoftServiciosResponseDTO {

    @Builder.Default
    private List<PerfilMicrosoftDTO> perfilesDisponibles = Collections.emptyList();

    @Builder.Default
    private List<GraphGroupDTO> gruposDelegados = Collections.emptyList();

    @Builder.Default
    private List<GraphGroupDTO> gruposSinConfiguracion = Collections.emptyList();
}