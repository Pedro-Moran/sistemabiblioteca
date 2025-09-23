package com.miapp.repository;

import com.miapp.model.BibliotecaCiclo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BibliotecaCicloRepository extends JpaRepository<BibliotecaCiclo, Long> {
    @Modifying
    @Query("delete from BibliotecaCiclo bc where bc.biblioteca.id = :bibliotecaId")
    void deleteByBibliotecaId(@Param("bibliotecaId") Long bibliotecaId);
}