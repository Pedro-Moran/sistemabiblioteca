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

import java.util.Collections;
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

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/json");
        return headers;
    }
}
