package com.miapp.repository;

import com.miapp.model.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Long> {
    // Si solo quieres las sedes activas:
    List<Sede> findByActivoTrue();
}

