package com.miapp.service;

import com.miapp.model.Programa;
import com.miapp.repository.ProgramaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramaService {

    private final ProgramaRepository repository;

    public ProgramaService(ProgramaRepository repository) {
        this.repository = repository;
    }

    public List<Programa> listActivos() {
        return repository.findByActivoTrue();
    }
}

