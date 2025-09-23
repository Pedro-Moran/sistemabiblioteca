package com.miapp.service;

import com.miapp.model.TipoMaterial;
import com.miapp.repository.TipoMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoMaterialService {

    private final TipoMaterialRepository repository;

    public TipoMaterialService(TipoMaterialRepository repository) {
        this.repository = repository;
    }

    public List<TipoMaterial> listAll() {
        return repository.findAll();
    }

    // O, si prefieres sólo activos:
    public List<TipoMaterial> listActivos() {
        return repository.findByActivoTrue();
    }

}
