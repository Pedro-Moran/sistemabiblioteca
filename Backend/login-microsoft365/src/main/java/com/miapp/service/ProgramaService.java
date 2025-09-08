package com.miapp.service;

import com.miapp.model.Programa;
import com.miapp.repository.ProgramaRepository;
import jakarta.transaction.Transactional;
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

    public List<Programa> listAll() {
        return repository.findAll();
    }

    public Programa getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programa no encontrado"));
    }

    @Transactional
    public Programa create(Programa programa) {
        programa.setIdPrograma(null);
        return repository.save(programa);
    }

    @Transactional
    public Programa update(Long id, Programa datos) {
        Programa programa = getById(id);
        programa.setDescripcion(datos.getDescripcion());
        programa.setActivo(datos.getActivo());
        return repository.save(programa);
    }

    @Transactional
    public void delete(Long id) {
        Programa programa = getById(id);
        programa.setActivo(false);
        repository.save(programa);
    }
}