package com.miapp.service;

import com.azure.core.credential.TokenRequestContext;
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import org.springframework.http.HttpHeaders;
import com.microsoft.graph.models.DirectoryObject;
import com.microsoft.graph.requests.GraphServiceClient;
import lombok.RequiredArgsConstructor;
import okhttp3.Request;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpStatusCodeException;

import com.miapp.model.dto.GraphGroupDTO;
import com.miapp.model.dto.GraphGroupResponseDTO;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class AzureService {

    @Value("${azure.ad.tenant-id}")
    private String tenantId;

    @Value("${azure.ad.client-id}")
    private String clientId;

    @Value("${azure.ad.client-secret}")
    private String clientSecret;

    /**
     * Obtiene un token de acceso para Microsoft Graph usando azure-identity.
     */
    private String getGraphAccessTokenWithAzureIdentity() {
        System.out.println("🔹 Obteniendo token de acceso para Graph API con azure-identity...");

        ClientSecretCredential credential = new ClientSecretCredentialBuilder()
                .tenantId(tenantId)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();

        TokenRequestContext requestContext = new TokenRequestContext()
                .addScopes("https://graph.microsoft.com/.default");

        String accessToken = credential.getToken(requestContext)
                .block()
                .getToken();

        System.out.println("✅ Token obtenido (azure-identity): " + accessToken);
        return accessToken;
    }

    private IAuthenticationResult getGraphAccessTokenWithMsal4j() throws Exception {
        System.out.println("🔹 Obteniendo token de acceso para Graph API con MSAL4J...");

        ConfidentialClientApplication app = ConfidentialClientApplication.builder(
                        clientId,
                        ClientCredentialFactory.createFromSecret(clientSecret))
                .authority("https://login.microsoftonline.com/" + tenantId)
                .build();

        ClientCredentialParameters parameters = ClientCredentialParameters.builder(
                        Collections.singleton("https://graph.microsoft.com/.default"))
                .build();

        IAuthenticationResult result = app.acquireToken(parameters).get();
        System.out.println("✅ Token obtenido (MSAL4J): " + result.accessToken());
        return result;
    }

    /**
     * Añade un usuario a un grupo en Microsoft Graph usando azure-identity para obtener el token.
     */
    public void addUserToGroupWithAzureIdentity(String userId, String groupId) throws Exception {
        String accessToken = getGraphAccessTokenWithAzureIdentity();

        System.out.println("🔹 Agregando usuario " + userId + " al grupo " + groupId + " con token de azure-identity");

        GraphServiceClient<Request> graphClient = GraphServiceClient
                .builder()
                .authenticationProvider(requestUrl ->
                        CompletableFuture.completedFuture("Bearer " + accessToken))
                .buildClient();

        DirectoryObject directoryObject = new DirectoryObject();
        directoryObject.id = userId;

        try {
            graphClient.groups(groupId)
                    .members()
                    .references()
                    .buildRequest()
                    .post(directoryObject);
            System.out.println("✅ Usuario agregado correctamente al grupo con azure-identity.");
        } catch (Exception e) {
            System.err.println("❌ Error al agregar usuario con azure-identity: " + e.getMessage());
            throw e;
        }
    }

    public void addUserToGroupWithMsal4j(String userId, String groupId) throws Exception {
        IAuthenticationResult result = getGraphAccessTokenWithMsal4j();
        String accessToken = result.accessToken();

        System.out.println("🔹 Agregando usuario " + userId + " al grupo " + groupId + " con token de MSAL4J");

        GraphServiceClient<Request> graphClient = GraphServiceClient
                .builder()
                .authenticationProvider(requestUrl ->
                        CompletableFuture.completedFuture("Bearer " + accessToken))
                .buildClient();

        DirectoryObject directoryObject = new DirectoryObject();
        directoryObject.id = userId;

        try {
            graphClient.groups(groupId)
                    .members()
                    .references()
                    .buildRequest()
                    .post(directoryObject);
            System.out.println("✅ Usuario agregado correctamente al grupo con MSAL4J.");
        } catch (Exception e) {
            System.err.println("❌ Error al agregar usuario con MSAL4J: " + e.getMessage());
            throw e;
        }
    }

    public boolean usuarioPerteneceAlTenant(String email) {
        String accessToken = getGraphAccessTokenWithAzureIdentity(); // Obtiene el token de Microsoft Graph

        String url = "https://graph.microsoft.com/v1.0/users/" + email;

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> request = new HttpEntity<>(null, createHeaders(accessToken));

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            return response.getStatusCode().is2xxSuccessful(); // Si el usuario existe en el tenant, retorna true
        } catch (Exception e) {
            return false; // Si la petición falla, el usuario no pertenece al tenant
        }
    }

    /**
     * Obtiene los grupos (perfiles/servicios) a los que pertenece el usuario autenticado utilizando su token delegado.
     *
     * @param userAccessToken token de acceso emitido para el usuario final (obtenido desde el frontend con MSAL, por ejemplo).
     * @return listado de grupos asociados al usuario en Azure AD.
     */
    public List<GraphGroupDTO> obtenerServiciosConTokenUsuario(String userAccessToken) {
        if (userAccessToken == null || userAccessToken.isBlank()) {
            throw new IllegalArgumentException("El token de Microsoft es obligatorio para consultar los servicios.");
        }

        String url = "https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = createHeaders(userAccessToken);
        headers.set("ConsistencyLevel", "eventual"); // Requerido para utilizar $count en la consulta

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<GraphGroupResponseDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    request,
                    GraphGroupResponseDTO.class
            );

            GraphGroupResponseDTO body = response.getBody();
            if (body == null || body.getValue() == null) {
                return Collections.emptyList();
            }

            List<GraphGroupDTO> groups = body.getValue();
            Integer count = body.getCount();
            System.out.println("✅ Servicios obtenidos desde Microsoft Graph: " +
                    (count != null ? count : groups.size()));
            if (groups != null && !groups.isEmpty()) {
                System.out.println("📋 Detalle de roles/grupos recibidos desde Microsoft:");
                for (GraphGroupDTO group : groups) {
                    if (group == null) {
                        continue;
                    }
                    String id = group.getId() != null ? group.getId() : "(sin id)";
                    String nombre = group.getDisplayName() != null ? group.getDisplayName() : "(sin nombre)";
                    String alias = group.getMailNickname();
                    String descripcion = group.getDescription();
                    StringBuilder detalle = new StringBuilder("   • ")
                            .append(id)
                            .append(" | ")
                            .append(nombre);
                    if (alias != null && !alias.isBlank()) {
                        detalle.append(" | alias: ").append(alias);
                    }
                    if (descripcion != null && !descripcion.isBlank()) {
                        detalle.append(" | descripción: ").append(descripcion);
                    }
                    System.out.println(detalle);
                }
            } else {
                System.out.println("📋 Microsoft Graph no devolvió roles/grupos para el token proporcionado.");
            }
            return groups;
        } catch (HttpStatusCodeException ex) {
            System.err.println("❌ Error al consultar Microsoft Graph: " + ex.getStatusCode() + " - " + ex.getResponseBodyAsString());
            throw new RuntimeException("Error al consultar Microsoft Graph: " + ex.getResponseBodyAsString(), ex);
        } catch (Exception e) {
            System.err.println("❌ Error inesperado al consultar Microsoft Graph: " + e.getMessage());
            throw new RuntimeException("Error inesperado al consultar Microsoft Graph", e);
        }
    }

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/json");
        return headers;
    }
}
