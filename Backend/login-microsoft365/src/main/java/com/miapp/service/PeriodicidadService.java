package com.miapp.service;

import com.miapp.model.Periodicidad;
import com.miapp.repository.PeriodicidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PeriodicidadService {
    private final PeriodicidadRepository periodicidadRepository;

    public PeriodicidadService(PeriodicidadRepository periodicidadRepository) {
        this.periodicidadRepository = periodicidadRepository;
    }

    public List<Periodicidad> listAll() {
        return periodicidadRepository.findAll();
    }
}