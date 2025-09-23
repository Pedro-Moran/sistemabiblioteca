package com.miapp.repository;

import com.miapp.model.DetalleBiblioteca;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @EntityGraph(attributePaths = {"biblioteca"})
    @Query("SELECT d FROM DetalleBiblioteca d WHERE d.idDetalle = :id")
    Optional<DetalleBiblioteca> findWithBibliotecaById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"biblioteca"})
    Optional<DetalleBiblioteca> findFirstByCodigoBarra(String codigoBarra);

    @EntityGraph(attributePaths = {"biblioteca"})
    List<DetalleBiblioteca> findTop20ByCodigoBarraContainingIgnoreCaseOrderByIdDetalleAsc(String codigoBarra);

    @EntityGraph(attributePaths = {"biblioteca"})
    List<DetalleBiblioteca> findTop20ByBiblioteca_CodigoLocalizacionContainingIgnoreCaseOrderByIdDetalleAsc(String codigoLocalizacion);
    @Query("SELECT d " +
            "FROM DetalleBiblioteca d " +
            "     JOIN FETCH d.biblioteca b " +
            "WHERE d.idEstado = 3")
    List<DetalleBiblioteca> findAllConBibliotecaReservados();

    @Query("""
            SELECT d
            FROM DetalleBiblioteca d
                LEFT JOIN FETCH d.biblioteca b
                LEFT JOIN FETCH d.sede s
            WHERE d.fechaPrestamo IS NOT NULL
              AND (:inicio IS NULL OR d.fechaPrestamo >= :inicio)
              AND (:fin IS NULL OR d.fechaPrestamo <= :fin)
            """)
    List<DetalleBiblioteca> findPrestadosBetween(@Param("inicio") LocalDateTime inicio,
                                                 @Param("fin") LocalDateTime fin);

    /**
     * Retorna el primer detalle que coincida con el número de ingreso indicado.
     * Se usa {@code findFirst} para evitar excepciones cuando existan múltiples
     * registros con el mismo número.
     */
    @EntityGraph(attributePaths = {"biblioteca"})
    Optional<DetalleBiblioteca> findFirstByNumeroIngreso(Long numeroIngreso);
    long countByFechaPrestamoIsNotNullAndFechaFinIsNull();

    long countByFechaPrestamoBetween(LocalDateTime inicio, LocalDateTime fin);
}