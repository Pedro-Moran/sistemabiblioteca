package com.miapp.repository;

import com.miapp.model.DetalleBiblioteca;
import com.miapp.model.OcurrenciaBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import com.miapp.model.dto.EjemplarPrestadoDTO;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.miapp.model.dto.EjemplarNoPrestadoDTO;
import com.miapp.model.dto.VisitanteBibliotecaVirtualDTO;
import org.springframework.data.repository.query.Param;


public interface OcurrenciaBibliotecaRepository
        extends JpaRepository<OcurrenciaBiblioteca, Long> {

    /** Obtiene ocurrencias asociadas a materiales bibliográficos */
    List<OcurrenciaBiblioteca> findByDetalleBibliotecaIsNotNullOrderByIdDesc();

    /** Obtiene ocurrencias asociadas a equipos de cómputo */
    List<OcurrenciaBiblioteca> findByDetallePrestamoIsNotNullOrderByIdDesc();

    /** Lista todas las ocurrencias ordenadas de forma descendente */
    List<OcurrenciaBiblioteca> findAllByOrderByIdDesc();

    /** Obtiene el máximo ID registrado */
    @Query("SELECT COALESCE(MAX(o.id),0) FROM OcurrenciaBiblioteca o")
    Long findMaxId();

    /** Ocurrencias registradas para un usuario dado */
    List<OcurrenciaBiblioteca> findByCodigoUsuario(String codigoUsuario);

    /**
     * Búsqueda sin diferenciar mayúsculas/minúsculas del código de usuario.
     */
    List<OcurrenciaBiblioteca> findByCodigoUsuarioIgnoreCase(String codigoUsuario);

    /** Obtiene solo las ocurrencias pendientes de un usuario (sin regularizar ni anuladas) */
    @Query("SELECT o FROM OcurrenciaBiblioteca o " +
            "WHERE lower(o.codigoUsuario) = lower(:codigoUsuario) " +
            "AND (o.regulariza IS NULL OR o.regulariza = 0) " +
            "AND (o.anulado IS NULL OR o.anulado = 0)")
    List<OcurrenciaBiblioteca> findPendientesByCodigoUsuarioIgnoreCase(@Param("codigoUsuario") String codigoUsuario);

    /** Indica si existe una ocurrencia asociada al detalle dado */
    boolean existsByDetalleBiblioteca(DetalleBiblioteca detalleBiblioteca);

    /**
     * Variante que devuelve tanto pendientes sin costear como aquellas ya
     * costeadas pero que siguen sin regularizar, ordenadas por fecha.
     */
    @Query("SELECT o FROM OcurrenciaBiblioteca o " +
            "WHERE lower(o.codigoUsuario) = lower(:codigoUsuario) " +
            "AND (o.anulado IS NULL OR o.anulado = 0) " +
            "AND (o.regulariza IS NULL OR o.regulariza = 0) " +
            "ORDER BY o.fechaOcurrencia DESC")
    List<OcurrenciaBiblioteca> findActivasByCodigoUsuarioIgnoreCase(@Param("codigoUsuario") String codigoUsuario);

    /** Obtiene las ocurrencias que ya fueron costeadas */
    List<OcurrenciaBiblioteca> findByEstadoCostoOrderByIdDesc(Integer estadoCosto);

    /**
     * Devuelve los ejemplares de material bibliográfico más prestados
     * junto con la cantidad de préstamos realizados.
     */
    @Query(
            "SELECT new com.miapp.model.dto.EjemplarPrestadoDTO(" +
                    " d.idDetalle," +
                    " b.titulo," +
                    " coalesce(d.cantidadPrestamos, 0)," +
                    " c.ciclo," +
                    " b.codigoLocalizacion," +
                    " d.numeroIngreso," +
                    " b.anioPublicacion," +
                    " b.autorPersonal" +
                    ") " +
                    "FROM DetalleBiblioteca d " +
                    "JOIN d.biblioteca b " +
                    "LEFT JOIN b.ciclos c " +
                    "WHERE coalesce(d.cantidadPrestamos, 0) > 0 " +
                    "AND d.idEstado = 2 " +
                    "AND b.idEstado = 2 " +
                    "AND (:sede IS NULL OR d.sede.id = :sede) " +
                    "AND (:tipoMaterial IS NULL OR d.tipoMaterial.idTipoMaterial = :tipoMaterial) " +
                    "AND (:especialidad IS NULL OR b.especialidad.idEspecialidad = :especialidad) " +
                    "AND (:ciclo IS NULL OR c.ciclo = :ciclo) " +
                    "AND (:numeroIngreso IS NULL OR d.numeroIngreso = :numeroIngreso) " +
                    "AND (:fechaInicio IS NULL OR d.fechaInicio >= :fechaInicio) " +
                    "AND (:fechaFin IS NULL OR d.fechaInicio <= :fechaFin) " +
                    "ORDER BY d.idDetalle DESC")
    List<EjemplarPrestadoDTO> reporteEjemplarMasPrestado(
            @Param("sede") Long sede,
            @Param("tipoMaterial") Long tipoMaterial,
            @Param("especialidad") Long especialidad,
            @Param("ciclo") Integer ciclo,
            @Param("numeroIngreso") Long numeroIngreso,
            @Param("fechaInicio") java.time.LocalDate fechaInicio,
            @Param("fechaFin") java.time.LocalDate fechaFin);

    /**
     * Devuelve los ejemplares de material bibliográfico que nunca se han prestado
     * filtrando por los parámetros indicados.
     */
    @Query(
            "SELECT new com.miapp.model.dto.EjemplarNoPrestadoDTO(" +
                    " d.idDetalle," +
                    " b.titulo," +
                    " b.codigoLocalizacion," +
                    " d.numeroIngreso," +
                    " b.autorPersonal," +
                    " b.anioPublicacion" +
                    ") " +
                    "FROM DetalleBiblioteca d " +
                    "JOIN d.biblioteca b " +
                    "LEFT JOIN b.ciclos c " +
                    "WHERE coalesce(d.cantidadPrestamos,0) = 0 " +
                    "AND d.idEstado = 2 " +
                    "AND b.idEstado = 2 " +
                    "AND (:sede IS NULL OR d.sede.id = :sede) " +
                    "AND (:tipoMaterial IS NULL OR d.tipoMaterial.idTipoMaterial = :tipoMaterial) " +
                    "AND (:especialidad IS NULL OR b.especialidad.idEspecialidad = :especialidad) " +
                    "AND (:ciclo IS NULL OR c.ciclo = :ciclo) " +
                    "AND (:numeroIngreso IS NULL OR d.numeroIngreso = :numeroIngreso) " +
                    "AND (d.fechaInicio IS NULL OR ((:fechaInicio IS NULL OR d.fechaInicio >= :fechaInicio) " +
                    "AND (:fechaFin IS NULL OR d.fechaInicio <= :fechaFin))) " +
                    "ORDER BY d.idDetalle DESC")
    List<EjemplarNoPrestadoDTO> reporteEjemplarNoPrestado(
            @Param("sede") Long sede,
            @Param("tipoMaterial") Long tipoMaterial,
            @Param("especialidad") Long especialidad,
            @Param("ciclo") Integer ciclo,
            @Param("numeroIngreso") Long numeroIngreso,
            @Param("fechaInicio") java.time.LocalDate fechaInicio,
            @Param("fechaFin") java.time.LocalDate fechaFin);

}
