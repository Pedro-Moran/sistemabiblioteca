package com.miapp.repository;

import com.miapp.model.ProgramaMotivoAccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgramaMotivoAccionRepository extends JpaRepository<ProgramaMotivoAccion, Long> {

    Optional<ProgramaMotivoAccion> findFirstByEstadoProgramaIgnoreCaseAndMotivoAccionIgnoreCaseAndActivoTrue(
            String estadoPrograma,
            String motivoAccion
    );
}