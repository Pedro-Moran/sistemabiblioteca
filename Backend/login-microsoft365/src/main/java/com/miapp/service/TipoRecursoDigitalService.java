package com.miapp.service;

import com.miapp.repository.TipoRecursoDigitalRepository;
import com.miapp.service.impl.TipoRecursoDigitalDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TipoRecursoDigitalService {
    private final TipoRecursoDigitalRepository repo;

    public List<TipoRecursoDigitalDTO> listar() {
        return repo.findAll().stream()
                .map(e -> {
                    TipoRecursoDigitalDTO d = new TipoRecursoDigitalDTO();
                    d.setId(e.getId());
                    d.setDescripcion(e.getDescripcion());
                    return d;
                })
                .collect(Collectors.toList());
    }
}
