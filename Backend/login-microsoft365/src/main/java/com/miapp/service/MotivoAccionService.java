package com.miapp.service;

import com.miapp.model.MotivoAccion;
import com.miapp.repository.MotivoAccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotivoAccionService {

    private final MotivoAccionRepository repository;

    public MotivoAccionService(MotivoAccionRepository repository) {
        this.repository = repository;
    }

    public List<MotivoAccion> listAll() {
        return repository.findAll();
    }

    public List<MotivoAccion> listActivos() {
        return repository.findByEstadoTrue();
    }

    public MotivoAccion getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("MotivoAccion no encontrado"));
    }

    @Transactional
    public MotivoAccion create(MotivoAccion motivo) {
        motivo.setIdMotivoAccion(null);
        return repository.save(motivo);
    }

    @Transactional
    public MotivoAccion update(Long id, MotivoAccion datos) {
        MotivoAccion motivo = getById(id);
        motivo.setDescripcion(datos.getDescripcion());
        motivo.setEstado(datos.getEstado());
        return repository.save(motivo);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}