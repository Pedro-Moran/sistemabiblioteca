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

    Optional<Usuario> findByNumDocumento(Long numDocumento);

//    List<Usuario> findByRol_IdRol(Long idRol);

    List<Usuario> findByRoles_IdRol(Long idrol);

    List<Usuario> findByLoginContainingIgnoreCaseOrEmailContainingIgnoreCase(String login,
                                                                             String email);
    List<Usuario> findByEmailContainingIgnoreCase(String email);

    /** Reporte de visitantes de biblioteca virtual a partir del contador de logeos */
    @Query(
            "SELECT new com.miapp.model.dto.VisitanteBibliotecaVirtualDTO(" +
                    " COALESCE(s.descripcion, '-')," +
                    " td.descripcion," +
                    " str(u.numDocumento)," +
                    " CONCAT(COALESCE(u.apellidoPaterno,''),' '," +
                    "        COALESCE(u.apellidoMaterno,''),' '," +
                    "        COALESCE(u.nombreUsuario,''))," +
                    " COALESCE(r.descripcion, 'Sin Rol')," +
                    " COALESCE(u.loginCount,0) )" +
                    "FROM Usuario u " +
                    "LEFT JOIN Sede s ON u.idSede = s.id " +
                    "LEFT JOIN TipoDocumento td ON u.tipodocumento.idTipoDocumento = td.idTipoDocumento " +
                    "LEFT JOIN u.roles r " +
                    "WHERE COALESCE(u.loginCount,0) > 0 " +
                    "ORDER BY COALESCE(u.loginCount,0) DESC")
    List<VisitanteBibliotecaVirtualDTO> reporteVisitantesBibliotecaVirtual();

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM USUARIO_ROL WHERE IDROL = :idRol", nativeQuery = true)
    void removeRolFromUsuarios(@Param("idRol") Long idRol);
}
