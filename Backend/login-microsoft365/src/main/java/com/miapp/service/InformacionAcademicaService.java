package com.miapp.service;

import com.miapp.model.dto.InformacionAcademicaDetalleDTO;
import com.miapp.model.dto.InformacionAcademicaResponse;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class InformacionAcademicaService {

    private static final String ENDPOINT = "https://app.upsjb.edu.pe/apisIntegracionesAcademico/api/v1/integracion/academico/obtener-informacion-persona";

    private final RestTemplate restTemplate;

    public InformacionAcademicaService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public List<InformacionAcademicaDetalleDTO> obtenerInformacionAcademica(String correo) {
        if (correo == null || correo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }

        try {
            ResponseEntity<InformacionAcademicaResponse> response = restTemplate.postForEntity(
                    ENDPOINT,
                    Map.of("correo", correo),
                    InformacionAcademicaResponse.class
            );

            InformacionAcademicaResponse body = response.getBody();
            if (body == null || body.getDetalleInformacionAcademica() == null) {
                return Collections.emptyList();
            }

            return body.getDetalleInformacionAcademica().stream()
                    .filter(item -> item != null
                            && item.getGradoAcademico() != null
                            && item.getCarrera() != null
                            && item.getCicloNivel() != null)
                    .toList();
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "No se pudo obtener la información académica",
                    ex
            );
        }
    }
}