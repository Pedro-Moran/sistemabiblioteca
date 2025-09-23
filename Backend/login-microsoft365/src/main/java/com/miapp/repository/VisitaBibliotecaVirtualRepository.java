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

    @Query(value = """
            SELECT s.DESCRIPCION,
                   u.LOGIN,
                   TRIM(v.CODIGOUSUARIO) AS CODIGO_VISITA,
                   u.APELLIDOPATERNO,
                   u.APELLIDOMATERNO,
                   u.NOMBREUSUARIO,
                   MAX(r.DESCRIPCION) AS ROL_DESCRIPCION,
                   e.DESCRIPCION AS ESPECIALIDAD,
                   p.DESCRIPCION AS PROGRAMA,
                   u.CICLO,
                   u.EMAIL,
                   COUNT(DISTINCT v.IDVISITABIBVIR) AS TOTAL_VISITAS
            FROM VISITASBIBVIR v
            LEFT JOIN USUARIO u ON (
                    UPPER(TRIM(u.LOGIN)) = UPPER(TRIM(v.CODIGOUSUARIO))
                 OR UPPER(TRIM(u.EMAIL)) = UPPER(TRIM(v.CODIGOUSUARIO))
                 OR (u.EMPLID IS NOT NULL AND UPPER(TRIM(u.EMPLID)) = UPPER(TRIM(v.CODIGOUSUARIO)))
            )
            LEFT JOIN USUARIO_ROL ur ON ur.IDUSUARIO = u.IDUSUARIO
            LEFT JOIN ROLUSUARIO r ON r.IDROL = ur.IDROL
            LEFT JOIN ESPECIALIDAD e ON e.IDESPECIALIDAD = u.IDESPECIALIDAD
            LEFT JOIN PROGRAMA p ON p.IDPROGRAMA = u.IDPROGRAMA
            LEFT JOIN SEDE s ON s.ID = u.IDSEDE
            WHERE (:inicio IS NULL OR COALESCE(v.FECHAREGISTRO, v.HORAINGRESO, v.HORASALIDA) >= :inicio)
              AND (:fin IS NULL OR COALESCE(v.FECHAREGISTRO, v.HORAINGRESO, v.HORASALIDA) < :fin)
              AND v.CODIGOUSUARIO IS NOT NULL
              AND TRIM(v.CODIGOUSUARIO) <> ''
              AND (
                    :codigoNormalizado IS NULL
                 OR UPPER(TRIM(v.CODIGOUSUARIO)) = :codigoNormalizado
                 OR (u.LOGIN IS NOT NULL AND UPPER(TRIM(u.LOGIN)) = :codigoNormalizado)
                 OR (u.EMAIL IS NOT NULL AND UPPER(TRIM(u.EMAIL)) = :codigoNormalizado)
                 OR (u.EMPLID IS NOT NULL AND UPPER(TRIM(u.EMPLID)) = :codigoNormalizado)
              )
            GROUP BY s.DESCRIPCION,
                     u.LOGIN,
                     TRIM(v.CODIGOUSUARIO),
                     u.APELLIDOPATERNO,
                     u.APELLIDOMATERNO,
                     u.NOMBREUSUARIO,
                     e.DESCRIPCION,
                     p.DESCRIPCION,
                     u.CICLO,
                     u.EMAIL
            ORDER BY COUNT(DISTINCT v.IDVISITABIBVIR) DESC
            """, nativeQuery = true)
    List<Object[]> resumenVisitantesBibliotecaVirtual(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin,
            @Param("codigoNormalizado") String codigoNormalizado);
}