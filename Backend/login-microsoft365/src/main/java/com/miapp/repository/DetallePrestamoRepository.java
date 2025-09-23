package com.miapp.repository;

import com.miapp.model.DetallePrestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetallePrestamoRepository
        extends JpaRepository<DetallePrestamo, Long>,
        JpaSpecificationExecutor<DetallePrestamo> {
    List<DetallePrestamo> findByEstado_Descripcion(String descripcionEstado);
    List<DetallePrestamo> findByEstadoDescripcionIgnoreCase(String descripcion);
    List<DetallePrestamo> findByCodigoUsuario(String codigoUsuario);
    /** Devuelve los préstamos del usuario que aún no fueron recepcionados */
    List<DetallePrestamo> findByCodigoUsuarioAndFechaRecepcionIsNull(String codigoUsuario);

    /** Variante sin distinguir mayúsculas/minúsculas */
    List<DetallePrestamo> findByCodigoUsuarioIgnoreCase(String codigoUsuario);

    /** Variante para pendientes sin distinguir mayúsculas/minúsculas */
    List<DetallePrestamo> findByCodigoUsuarioIgnoreCaseAndFechaRecepcionIsNull(String codigoUsuario);
    List<DetallePrestamo> findByCodigoSedeAndEstado_DescripcionIgnoreCase(
            String codigoSede,
            String descripcionEstado
    );

    List<DetallePrestamo> findByEquipo_IdEquipo(Long equipoId);

    java.util.Optional<DetallePrestamo> findTopByEquipo_IdEquipoOrderByFechaFinDesc(Long equipoId);

    List<DetallePrestamo> findByEquipo_IdEquipoAndCodigoSede(Long equipoId, String codigoSede);

    List<DetallePrestamo> findByEstado_DescripcionIn(List<String> estados);
    List<DetallePrestamo> findByEstado_DescripcionInAndCodigoSedeIgnoreCase(
            List<String> estados, String codigoSede);

    // Para TaskScheduler no lo necesitas, pero si quisieras con @Scheduled:
    List<DetallePrestamo> findByFechaFinBetweenAndReminder72SentFalse(
            LocalDateTime start, LocalDateTime end);

    List<DetallePrestamo> findByFechaFinBetweenAndReminder48SentFalse(
            LocalDateTime start, LocalDateTime end);

    long countByFechaPrestamoIsNotNullAndFechaRecepcionIsNull();

    long countByFechaPrestamoBetween(LocalDateTime inicio, LocalDateTime fin);

    @org.springframework.data.jpa.repository.Query(
            "SELECT new com.miapp.model.dto.UsuarioPrestamosDTO(" +
                    " MAX(dp.id)," +
                    " dp.codigoUsuario," +
                    " COALESCE(s.descripcion, s2.descripcion)," +
                    " COUNT(dp)) " +
                    "FROM DetallePrestamo dp " +
                    "LEFT JOIN Usuario u ON upper(u.login) = upper(dp.codigoUsuario) " +
                    "LEFT JOIN Sede s ON u.idSede = s.id " +
                    "LEFT JOIN Sede s2 ON dp.codigoSede = str(s2.id) " +
                    "WHERE (:sede IS NULL OR dp.codigoSede = :sede) " +
                    "AND (:especialidad IS NULL OR dp.codigoEscuela = :especialidad) " +
                    "AND (:programa IS NULL OR dp.codigoPrograma = :programa) " +
                    "AND (:ciclo IS NULL OR dp.codigoCiclo = :ciclo) " +
                    "AND (:fechaInicio IS NULL OR dp.fechaPrestamo >= :fechaInicio) " +
                    "AND (:fechaFin IS NULL OR dp.fechaPrestamo <= :fechaFin) " +
                    "GROUP BY dp.codigoUsuario, COALESCE(s.descripcion, s2.descripcion) " +
                    "ORDER BY MAX(dp.id) DESC" )
    List<com.miapp.model.dto.UsuarioPrestamosDTO> contarPrestamosPorUsuario(
            @org.springframework.data.repository.query.Param("sede") String sede,
            @org.springframework.data.repository.query.Param("especialidad") String especialidad,
            @org.springframework.data.repository.query.Param("programa") String programa,
            @org.springframework.data.repository.query.Param("ciclo") String ciclo,
            @org.springframework.data.repository.query.Param("fechaInicio") java.time.LocalDateTime fechaInicio,
            @org.springframework.data.repository.query.Param("fechaFin") java.time.LocalDateTime fechaFin);

    /**
     * Devuelve la cantidad de préstamos aprobados por usuario.
     * Se concatena el nombre completo del usuario en un solo campo.
     */
    @org.springframework.data.jpa.repository.Query(
            "SELECT new com.miapp.model.dto.UsuarioEquipoPrestamosDTO(" +
                    " MAX(dp.id)," +
                    " CONCAT(COALESCE(u.nombreUsuario, ''),' '," +
                    "        COALESCE(u.apellidoPaterno, ''),' '," +
                    "        COALESCE(u.apellidoMaterno, ''))," +
                    " s.descripcion," +
                    " COUNT(dp)) " +
                    "FROM DetallePrestamo dp " +
                    "LEFT JOIN Usuario u ON upper(u.login) = upper(dp.codigoUsuario) " +
                    "LEFT JOIN Sede s ON u.idSede = s.id " +
                    "WHERE upper(dp.estado.descripcion) IN ('PRESTADO EN SALA', 'PRESTAMO A DOMICILIO', 'PRESTADO EN SALA Y DOMICILIO') " +
                    "GROUP BY u.nombreUsuario, u.apellidoPaterno, u.apellidoMaterno, s.descripcion " +
                    "ORDER BY MAX(dp.id) DESC" )
    List<com.miapp.model.dto.UsuarioEquipoPrestamosDTO> contarPrestamosEquipoPorUsuario();
}
