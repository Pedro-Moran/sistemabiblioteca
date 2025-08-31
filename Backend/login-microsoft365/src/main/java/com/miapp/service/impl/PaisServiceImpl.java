package com.miapp.service.impl;

import com.miapp.model.Pais;
import com.miapp.repository.PaisRepository;
import com.miapp.service.PaisService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaisServiceImpl implements PaisService {
    private final PaisRepository repo;
    public PaisServiceImpl(PaisRepository repo) {
        this.repo = repo;
    }
    @Override
    public List<Pais> listAll() {
        return repo.findAll();
    }
}