package com.miapp.service.impl;

import com.miapp.model.Idioma;
import com.miapp.repository.IdiomaRepository;
import com.miapp.service.IdiomaService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IdiomaServiceImpl implements IdiomaService {
    private final IdiomaRepository repo;
    public IdiomaServiceImpl(IdiomaRepository repo) {
        this.repo = repo;
    }
    @Override
    public List<Idioma> listAll() {
        return repo.findAll();
    }
}
