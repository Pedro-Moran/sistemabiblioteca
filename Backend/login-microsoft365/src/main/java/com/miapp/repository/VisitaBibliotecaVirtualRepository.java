package com.miapp.repository;

import com.miapp.model.VisitaBibliotecaVirtual;
import com.miapp.model.dto.VisitantesPorDiaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitaBibliotecaVirtualRepository extends JpaRepository<VisitaBibliotecaVirtual, Long> {

    @Query("select coalesce(max(v.id), 0) from VisitaBibliotecaVirtual v")
    Long findMaxId();

    @Query("""
            SELECT new com.miapp.model.dto.VisitantesPorDiaDTO(
                MIN(COALESCE(v.fechaRegistro, v.horaIngreso, v.horaSalida)),
                COUNT(v),
                COUNT(DISTINCT LOWER(v.codigoUsuario))
            )
            FROM VisitaBibliotecaVirtual v
            WHERE (:inicio IS NULL OR COALESCE(v.fechaRegistro, v.horaIngreso, v.horaSalida) >= :inicio)
              AND (:fin IS NULL OR COALESCE(v.fechaRegistro, v.horaIngreso, v.horaSalida) < :fin)
            GROUP BY function('TO_CHAR', COALESCE(v.fechaRegistro, v.horaIngreso, v.horaSalida), 'YYYY-MM-DD')
            ORDER BY MIN(COALESCE(v.fechaRegistro, v.horaIngreso, v.horaSalida))
            """)
    List<VisitantesPorDiaDTO> contarVisitasPorDia(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

}
