package com.miapp.repository;

import com.miapp.model.MotivoAccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MotivoAccionRepository extends JpaRepository<MotivoAccion, Long> {
    List<MotivoAccion> findByEstadoTrue();
}