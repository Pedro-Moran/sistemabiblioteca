package com.miapp.repository;

import com.miapp.model.MaterialBibliografico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialBibliograficoRepository extends JpaRepository<MaterialBibliografico, Long>, JpaSpecificationExecutor<MaterialBibliografico> {
    long countByEspecialidad_IdEspecialidad(Long idEspecialidad);
}