package com.miapp.service;

import com.miapp.model.Ciudad;
import com.miapp.model.dto.CiudadDTO;

import java.util.List;

public interface CiudadService {
    List<Ciudad> listAll();

    List<CiudadDTO> findByPais(String paisId);
}
