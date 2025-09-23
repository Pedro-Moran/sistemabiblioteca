package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IntegracionPersonaResponseDTO {

    @JsonProperty("status_code")
    private String statusCode;

    private String status;

    private String description;

    private IntegracionPersonaResultDTO result;
}