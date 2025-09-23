package com.miapp.service.external;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class DocumentoLookupService {
    private final RestTemplate restTemplate;

    public DocumentoLookupService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> consultar(String tipo, String numero) {
        String url = "https://app.upsjb.edu.pe/api-campus/PSIGW/RESTListeningConnector/PSFT_CS/SJB_CONSULTA_DNI_OPE_SERV.v1/Param/" + tipo + "/" + numero;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = response.getBody();
            if (body == null) {
                return null;
            }
            Map<String, Object> wrapper = (Map<String, Object>) body.get("SJB_CONSULTA_DNI_RESP");
            if (wrapper == null) {
                return null;
            }
            List<Map<String, Object>> list = (List<Map<String, Object>>) wrapper.get("SJB_CONSULTA_DNI");
            if (list == null || list.isEmpty()) {
                return null;
            }
            return list.get(0);
        } catch (RestClientException ex) {
            return null;
        }
    }
}