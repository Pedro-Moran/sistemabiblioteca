package com.miapp.service;

import com.miapp.model.Especialidad;
import com.miapp.repository.EspecialidadRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    @Transactional
    public Especialidad create(Especialidad especialidad) {
        String descripcion = especialidad.getDescripcion().trim();
        if (especialidadRepository.findByDescripcionIgnoreCase(descripcion).isPresent()) {
            throw new IllegalArgumentException("La especialidad ya se encuentra registrada");
        }
        especialidad.setDescripcion(descripcion);
        return especialidadRepository.save(especialidad);
    }

    /**
     * Alias de {@link #create(Especialidad)} para mantener compatibilidad con
     * controladores existentes que invocan a {@code save} al registrar nuevas
     * especialidades.
     */
    @Transactional
    public Especialidad save(Especialidad especialidad) {
        return create(especialidad);
    }

    public List<Especialidad> listActivas() {
        return especialidadRepository.findByActivoTrue();
    }

    public List<Especialidad> getActivos() {
        return listActivas();
    }

    public List<Especialidad> listAll() {
        return especialidadRepository.findAll();
    }

    public Especialidad getById(Long id) {
        return especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
    }

    @Transactional
    public Especialidad update(Long id, Especialidad datos) {
        Especialidad especialidad = getById(id);
        String descripcion = datos.getDescripcion().trim();
        if (!especialidad.getDescripcion().equalsIgnoreCase(descripcion)
                && especialidadRepository.findByDescripcionIgnoreCase(descripcion).isPresent()) {
            throw new IllegalArgumentException("La especialidad ya se encuentra registrada");
        }
        especialidad.setDescripcion(descripcion);
        especialidad.setActivo(datos.getActivo());
        return especialidadRepository.save(especialidad);
    }

    @Transactional
    public void delete(Long id) {
        Especialidad especialidad = getById(id);
        especialidad.setActivo(false);
        especialidadRepository.save(especialidad);
    }

}