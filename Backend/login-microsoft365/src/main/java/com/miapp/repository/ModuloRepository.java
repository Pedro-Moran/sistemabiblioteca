package com.miapp.repository;

import com.miapp.model.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {

    @Query(value = "SELECT m.* FROM CONF_MODULO m JOIN ROLUSUARIO_MODULO rm ON m.IDMODULO = rm.IDMODULO WHERE rm.IDROL = :idRol", nativeQuery = true)
    List<Modulo> findByRol(@Param("idRol") Long idRol);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO ROLUSUARIO_MODULO (IDROL, IDMODULO, IDUSUARIO) VALUES (:idRol, :idModulo, :idUsuario)", nativeQuery = true)
    void addModuloToRol(@Param("idRol") Long idRol, @Param("idModulo") Long idModulo, @Param("idUsuario") Long idUsuario);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ROLUSUARIO_MODULO WHERE IDROL = :idRol AND IDMODULO = :idModulo", nativeQuery = true)
    void removeModuloFromRol(@Param("idRol") Long idRol, @Param("idModulo") Long idModulo);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ROLUSUARIO_MODULO WHERE IDROL = :idRol", nativeQuery = true)
    void removeAllModulosFromRol(@Param("idRol") Long idRol);
}