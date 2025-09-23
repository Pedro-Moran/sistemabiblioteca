package com.miapp.service;

import com.miapp.model.Estado;
import com.miapp.repository.EstadoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EstadoService {

    private final EstadoRepository estadoRepository;

    public EstadoService(EstadoRepository estadoRepository) {
        this.estadoRepository = estadoRepository;
    }

    public List<Estado> getEstados() {
        // Puedes filtrar por activos o retornar todos, según lo necesites:
        return estadoRepository.findAll();
        // return estadoRepository.findByActivoTrue();
    }

}
