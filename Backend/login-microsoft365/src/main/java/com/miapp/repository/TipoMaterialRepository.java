package com.miapp.repository;

import com.miapp.model.TipoMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoMaterialRepository extends JpaRepository<TipoMaterial, Long> {
    // Si sólo deseas traer los activos, puedes usar:
    List<TipoMaterial> findByActivoTrue();
}
