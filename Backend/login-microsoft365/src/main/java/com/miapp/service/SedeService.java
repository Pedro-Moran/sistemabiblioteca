package com.miapp.service;

import com.miapp.model.Sede;
import com.miapp.repository.SedeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SedeService {

    private final SedeRepository sedeRepository;

    public SedeService(SedeRepository sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    public List<Sede> listActivas() {
        return sedeRepository.findByActivoTrue();
    }

    public List<Sede> getSedesActivas() {
        return listActivas();
    }

    public List<Sede> listAll() {
        return sedeRepository.findAll();
    }

    public Sede getById(Long id) {
        return sedeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sede no encontrada"));
    }

    @Transactional
    public Sede create(Sede sede) {
        sede.setId(null);
        return sedeRepository.save(sede);
    }

    @Transactional
    public Sede update(Long id, Sede datos) {
        Sede sede = getById(id);
        sede.setDescripcion(datos.getDescripcion());
        sede.setActivo(datos.getActivo());
        return sedeRepository.save(sede);
    }

    @Transactional
    public void delete(Long id) {
        Sede sede = getById(id);
        sede.setActivo(false);
        sedeRepository.save(sede);
    }
}