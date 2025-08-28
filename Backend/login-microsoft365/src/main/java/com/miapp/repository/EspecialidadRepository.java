package com.miapp.repository;

import com.miapp.model.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Long> {
    List<Especialidad> findByActivoTrue();

    Optional<Especialidad> findByDescripcionIgnoreCase(String descripcion);
}
