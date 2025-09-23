package com.miapp.service.impl;

import com.miapp.model.TipoAdquisicion;
import com.miapp.repository.TipoAdquisicionRepository;
import com.miapp.service.TipoAdquisicionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoAdquisicionServiceImpl implements TipoAdquisicionService {
    private final TipoAdquisicionRepository tipoAdquisicionRepository;
    public TipoAdquisicionServiceImpl(TipoAdquisicionRepository tipoAdquisicionRepository) {
        this.tipoAdquisicionRepository = tipoAdquisicionRepository;
    }
    @Override
    public List<TipoAdquisicion> listAll() {
        return tipoAdquisicionRepository.findAll();
    }

}
