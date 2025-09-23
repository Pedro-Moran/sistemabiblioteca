package com.miapp.service;

import com.miapp.model.ProgramaAccion;
import com.miapp.repository.ProgramaAccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramaAccionService {

    private final ProgramaAccionRepository repository;

    public ProgramaAccionService(ProgramaAccionRepository repository) {
        this.repository = repository;
    }

    public List<ProgramaAccion> listAll() {
        return repository.findAll();
    }

    public List<ProgramaAccion> listActivos() {
        return repository.findByEstadoTrue();
    }

    public ProgramaAccion getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProgramaAccion no encontrado"));
    }

    @Transactional
    public ProgramaAccion create(ProgramaAccion programa) {
        programa.setIdProgramaAccion(null);
        return repository.save(programa);
    }

    @Transactional
    public ProgramaAccion update(Long id, ProgramaAccion datos) {
        ProgramaAccion programa = getById(id);
        programa.setDescripcion(datos.getDescripcion());
        programa.setEstado(datos.getEstado());
        return repository.save(programa);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}