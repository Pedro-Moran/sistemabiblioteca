package com.miapp.repository;

import com.miapp.model.ProgramaAccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramaAccionRepository extends JpaRepository<ProgramaAccion, Long> {
    List<ProgramaAccion> findByEstadoTrue();
}