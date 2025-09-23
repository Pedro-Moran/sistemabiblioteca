package com.miapp.service.impl;

import com.miapp.model.Ciudad;
import com.miapp.model.dto.CiudadDTO;
import com.miapp.repository.CiudadRepository;
import com.miapp.service.CiudadService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CiudadServiceImpl implements CiudadService {
    private final CiudadRepository repo;
    public CiudadServiceImpl(CiudadRepository repo) {
        this.repo = repo;
    }
    @Override
    public List<Ciudad> listAll() {
        return repo.findAll();
    }
    @Override
    public List<CiudadDTO> findByPais(String paisId) {
        return repo.findByPaisPaisId(paisId)
                .stream()
                .map(c -> new CiudadDTO(c.getCodigoCiudad(), c.getNombreCiudad(), c.getPais().getPaisId()))
                .toList();
    }
}
