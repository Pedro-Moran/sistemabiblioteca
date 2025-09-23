package com.miapp.service;

import com.miapp.model.PerfilMicrosoft;
import com.miapp.model.dto.GraphGroupDTO;
import com.miapp.model.dto.MicrosoftServiciosResponseDTO;
import com.miapp.model.dto.PerfilMicrosoftDTO;
import com.miapp.repository.PerfilMicrosoftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerfilMicrosoftService {

    private final PerfilMicrosoftRepository perfilMicrosoftRepository;

    public List<PerfilMicrosoft> buscarPorGraphGroupIds(Collection<String> graphGroupIds) {
        if (graphGroupIds == null || graphGroupIds.isEmpty()) {
            return List.of();
        }
        Set<String> normalizados = graphGroupIds.stream()
                .map(this::normalizarId)
                .filter(id -> id != null && !id.isBlank())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (normalizados.isEmpty()) {
            return List.of();
        }

        return perfilMicrosoftRepository.findByGraphGroupIdInIgnoreCase(normalizados);
    }

    public MicrosoftServiciosResponseDTO construirRespuestaServicios(List<GraphGroupDTO> graphGroups) {
        if (graphGroups == null || graphGroups.isEmpty()) {
            return MicrosoftServiciosResponseDTO.builder().build();
        }

        Map<String, GraphGroupDTO> gruposPorId = new LinkedHashMap<>();
        for (GraphGroupDTO grupo : graphGroups) {
            if (grupo == null) {
                continue;
            }
            for (String identificador : extraerIdentificadores(grupo)) {
                gruposPorId.putIfAbsent(identificador, grupo);
            }
        }

        List<PerfilMicrosoft> perfilesConfigurados = buscarPorGraphGroupIds(gruposPorId.keySet());

        List<PerfilMicrosoftDTO> perfilesDTO = perfilesConfigurados.stream()
                .map(perfil -> convertirAPerfilDTO(perfil, gruposPorId.get(normalizarId(perfil.getGraphGroupId()))))
                .collect(Collectors.toList());

        Set<String> idsConfigurados = perfilesConfigurados.stream()
                .map(PerfilMicrosoft::getGraphGroupId)
                .map(this::normalizarId)
                .collect(Collectors.toSet());

        List<GraphGroupDTO> gruposSinConfig = graphGroups.stream()
                .filter(grupo -> {
                    Set<String> identificadores = extraerIdentificadores(grupo);
                    return identificadores.stream().noneMatch(idsConfigurados::contains);
                })
                .collect(Collectors.toList());

        return MicrosoftServiciosResponseDTO.builder()
                .perfilesDisponibles(perfilesDTO)
                .gruposDelegados(graphGroups)
                .gruposSinConfiguracion(gruposSinConfig)
                .build();
    }

    private PerfilMicrosoftDTO convertirAPerfilDTO(PerfilMicrosoft perfil, GraphGroupDTO group) {
        return PerfilMicrosoftDTO.builder()
                .graphGroupId(perfil.getGraphGroupId())
                .nombre(perfil.getNombre())
                .rolId(perfil.getRol() != null ? perfil.getRol().getIdRol() : null)
                .rolDescripcion(perfil.getRol() != null ? perfil.getRol().getDescripcion() : null)
                .graphGroup(group)
                .build();
    }

    private String normalizarId(String id) {
        if (id == null) {
            return null;
        }
        String trimmed = id.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        String colapsado = trimmed.replaceAll("\\s+", " ");
        return colapsado.toUpperCase(Locale.ROOT);
    }

    private Set<String> extraerIdentificadores(GraphGroupDTO grupo) {
        if (grupo == null) {
            return Set.of();
        }

        Set<String> ids = new LinkedHashSet<>();

        agregarIdentificador(ids, grupo.getId());
        agregarIdentificador(ids, grupo.getSecurityIdentifier());
        agregarIdentificador(ids, grupo.getMailNickname());
        agregarIdentificador(ids, grupo.getMail());
        agregarIdentificador(ids, grupo.getDisplayName());

        return ids;
    }

    private void agregarIdentificador(Set<String> ids, String candidato) {
        String normalizado = normalizarId(candidato);
        if (normalizado != null) {
            ids.add(normalizado);
        }
    }
}