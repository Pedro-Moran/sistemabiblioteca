package com.miapp.service;

import com.miapp.model.dto.IntegracionPersonaResponseDTO;
import com.miapp.model.dto.IntegracionPersonaResultDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class IntegracionPersonaService {

    private final RestTemplate restTemplate;
    private final String endpoint;
    private final String countryHeader;
    private final String providerHeader;
    private final String apiKeyHeader;

    public IntegracionPersonaService(RestTemplateBuilder restTemplateBuilder,
                                     @Value("${integracion.academico.persona.url}") String endpoint,
                                     @Value("${integracion.academico.persona.country}") String countryHeader,
                                     @Value("${integracion.academico.persona.provider}") String providerHeader,
                                     @Value("${integracion.academico.persona.api-key}") String apiKeyHeader) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
        this.endpoint = endpoint;
        this.countryHeader = countryHeader;
        this.providerHeader = providerHeader;
        this.apiKeyHeader = apiKeyHeader;
    }

    public Optional<IntegracionPersonaResultDTO> obtenerInformacionPersona(String correo) {
        if (correo == null || correo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("country", countryHeader);
        headers.set("provider", providerHeader);
        headers.set("apiKey", apiKeyHeader);

        Map<String, String> body = Map.of("correo", correo.toUpperCase(Locale.ROOT));
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<IntegracionPersonaResponseDTO> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    entity,
                    IntegracionPersonaResponseDTO.class
            );

            IntegracionPersonaResponseDTO payload = response.getBody();
            if (response.getStatusCode().is2xxSuccessful()
                    && payload != null
                    && payload.getResult() != null
                    && "200".equals(payload.getStatusCode())
                    && payload.getResult().getResultado() != null
                    && "OK".equalsIgnoreCase(payload.getResult().getResultado())) {
                return Optional.of(payload.getResult());
            }
            return Optional.empty();
        } catch (HttpStatusCodeException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Error al consultar integración académica: " + ex.getStatusCode(),
                    ex
            );
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "No se pudo consultar integración académica",
                    ex
            );
        }
    }

    public String getCountryHeader() {
        return countryHeader;
    }
}