package com.miapp.repository;

import com.miapp.model.Usuario;
import com.miapp.model.dto.VisitanteBibliotecaVirtualDTO;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);

    Optional<Usuario> findByLoginIgnoreCase(String login);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    Optional<Usuario> findByEmailInstIgnoreCase(String emailInst);

    Optional<Usuario> findByEmailPersonalIgnoreCase(String emailPersonal);

    Optional<Usuario> findByNumDocumento(Long numDocumento);

    Optional<Usuario> findByEmplid(String emplid);

//    List<Usuario> findByRol_IdRol(Long idRol);

    List<Usuario> findByRoles_IdRol(Long idrol);

    long countByPrograma_IdPrograma(Long idPrograma);

    long countByEspecialidad_IdEspecialidad(Long idEspecialidad);

    List<Usuario> findByLoginContainingIgnoreCaseOrEmailContainingIgnoreCase(String login,
                                                                             String email);
    List<Usuario> findByEmailContainingIgnoreCase(String email);

    long countByIdEstadoIgnoreCase(String estado);

    /** Reporte de visitantes de biblioteca virtual a partir del contador de logeos */
    @Query(
            "SELECT new com.miapp.model.dto.VisitanteBibliotecaVirtualDTO(" +
                    " COALESCE(s.descripcion, '-')," +
                    " 'N/A'," +
                    " COALESCE(u.login, '')," +
                    " CONCAT(COALESCE(u.apellidoPaterno,''),' '," +
                    "        COALESCE(u.apellidoMaterno,''),' '," +
                    "        COALESCE(u.nombreUsuario,''))," +
                    " COALESCE(r.descripcion, 'Sin Rol')," +
                    " COALESCE(e.descripcion, '-')," +
                    " COALESCE(p.descripcionPrograma, '-')," +
                    " COALESCE(u.ciclo, '-')," +
                    " COALESCE(u.email, '-')," +
                    " COALESCE(u.loginCount,0)," +
                    " COALESCE(u.loginCount,0) )" +
                    "FROM Usuario u " +
                    "LEFT JOIN Sede s ON u.idSede = s.id " +
                    "LEFT JOIN u.especialidad e " +
                    "LEFT JOIN u.programa p " +
                    "LEFT JOIN u.roles r " +
                    "WHERE COALESCE(u.loginCount,0) > 0 " +
                    "AND (:fechaInicio IS NULL OR u.fechaCreacion >= :fechaInicio) " +
                    "AND (:fechaFin IS NULL OR u.fechaCreacion <= :fechaFin) " +
                    "ORDER BY COALESCE(u.loginCount,0) DESC")
    List<VisitanteBibliotecaVirtualDTO> reporteVisitantesBibliotecaVirtual(
            @Param("fechaInicio") java.time.LocalDateTime fechaInicio,
            @Param("fechaFin") java.time.LocalDateTime fechaFin);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM USUARIO_ROL WHERE IDROL = :idRol", nativeQuery = true)
    void removeRolFromUsuarios(@Param("idRol") Long idRol);
}