package com.miapp.repository;

import com.miapp.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EstadoRepository extends JpaRepository<Estado, Long> {
    // También podrías filtrar por activo si así lo deseas:
    Optional<Estado> findByDescripcionIgnoreCase(String descripcion);
    List<Estado> findByActivoTrue();
    Optional<Estado> findByDescripcion(String descripcion);
}
