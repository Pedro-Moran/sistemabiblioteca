package com.miapp.repository;

import com.miapp.model.DetalleBiblioteca;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DetalleBibliotecaRepository extends JpaRepository<DetalleBiblioteca, Long> {
    // devuelve todos los detalles de una biblioteca
    @Query("""
            SELECT d
            FROM DetalleBiblioteca d
                LEFT JOIN FETCH d.sede
                LEFT JOIN FETCH d.tipoAdquisicion
                LEFT JOIN FETCH d.tipoMaterial
            WHERE d.biblioteca.id = :bibliotecaId
            """)
    List<DetalleBiblioteca> findByBibliotecaId(@Param("bibliotecaId") Long bibliotecaId);

    List<DetalleBiblioteca> findByIdEstado(Long idEstado);
    boolean existsByBiblioteca_IdAndSede_Id(Long bibliotecaId, Long sedeId);
    boolean existsByBiblioteca_IdAndTipoMaterial_IdTipoMaterial(Long bibliotecaId, Long tipoMaterialId);
    boolean existsByBiblioteca_IdAndIdEstado(Long bibliotecaId, Long idEstado);
    @Query("SELECT d " +
            "FROM DetalleBiblioteca d " +
            "     JOIN FETCH d.biblioteca b " +
            "WHERE d.idEstado = 3")
    List<DetalleBiblioteca> findAllConBibliotecaReservados();
}
