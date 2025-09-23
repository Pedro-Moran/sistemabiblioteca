package com.miapp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Representa un grupo de Azure AD devuelto por Microsoft Graph.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GraphGroupDTO {

    private String id;

    private String displayName;

    private String description;

    private String mail;

    private String mailNickname;

    @JsonProperty("securityIdentifier")
    private String securityIdentifier;

    @JsonProperty("groupTypes")
    private List<String> groupTypes;
}