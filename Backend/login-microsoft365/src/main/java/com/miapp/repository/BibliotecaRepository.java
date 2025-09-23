package com.miapp.repository;

import com.miapp.model.Biblioteca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@Repository
public interface BibliotecaRepository
        extends JpaRepository<Biblioteca, Long>,
        JpaSpecificationExecutor<Biblioteca> {
    List<Biblioteca> findByIdEstado(Long idEstado);

    @EntityGraph(attributePaths = {
            "especialidad", "pais", "ciudad", "tipoMaterial"
    })
    Page<Biblioteca> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {
            "especialidad", "pais", "ciudad", "tipoMaterial"
    })
    Page<Biblioteca> findAll(Specification<Biblioteca> spec, Pageable pageable);

    @Query("SELECT COALESCE(MAX(b.numeroDeIngreso),0) FROM Biblioteca b")
    Long findMaxNumeroDeIngreso();

    boolean existsByNumeroDeIngreso(Long numeroDeIngreso);

    long countByEspecialidadIdEspecialidad(Long idEspecialidad);
}