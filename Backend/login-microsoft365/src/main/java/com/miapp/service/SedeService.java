package com.miapp.service;

import com.miapp.model.Sede;
import com.miapp.repository.SedeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SedeService {

    private final SedeRepository sedeRepository;

    public SedeService(SedeRepository sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    public List<Sede> getSedesActivas() {
        // Si deseas solo las sedes activas:
        return sedeRepository.findByActivoTrue();
        // O para obtener todas:
        // return sedeRepository.findAll();
    }
}
