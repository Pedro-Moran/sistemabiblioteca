package com.miapp.service;

import com.miapp.model.Programa;
import com.miapp.repository.ProgramaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramaService {

    private final ProgramaRepository repository;

    public ProgramaService(ProgramaRepository repository) {
        this.repository = repository;
    }

    public List<Programa> listActivos() {
        return repository.findByActivoTrue();
    }

    public List<Programa> listAll() {
        return repository.findAll();
    }

    public Programa getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programa no encontrado"));
    }

    @Transactional
    public Programa create(Programa programa) {
        programa.setIdPrograma(null);
        programa.setPrograma(normalizarCodigo(programa.getPrograma()));
        programa.setDescripcionPrograma(normalizarDescripcion(programa.getDescripcionPrograma()));
        if (programa.getActivo() == null) {
            programa.setActivo(true);
        }
        validar(programa);
        return repository.save(programa);
    }

    @Transactional
    public Programa update(Long id, Programa datos) {
        Programa programa = getById(id);
        if (datos.getPrograma() != null) {
            programa.setPrograma(normalizarCodigo(datos.getPrograma()));
        }
        if (datos.getDescripcionPrograma() != null) {
            programa.setDescripcionPrograma(normalizarDescripcion(datos.getDescripcionPrograma()));
        }
        if (datos.getActivo() != null) {
            programa.setActivo(datos.getActivo());
        }
        validar(programa);
        return repository.save(programa);
    }

    @Transactional
    public void delete(Long id) {
        Programa programa = getById(id);
        programa.setActivo(false);
        repository.save(programa);
    }

    private String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    private String normalizarDescripcion(String descripcion) {
        return descripcion == null ? null : descripcion.trim();
    }

    private void validar(Programa programa) {
        if (programa.getPrograma() == null || programa.getPrograma().isBlank()) {
            throw new IllegalArgumentException("El código del programa es obligatorio");
        }
        if (programa.getDescripcionPrograma() == null || programa.getDescripcionPrograma().isBlank()) {
            throw new IllegalArgumentException("La descripción del programa es obligatoria");
        }
    }
}