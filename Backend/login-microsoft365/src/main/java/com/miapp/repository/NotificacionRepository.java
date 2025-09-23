package com.miapp.repository;

import com.miapp.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion,Long> {
    List<Notificacion> findByUsuarioDestinoAndLeidaFalse(String usuario);
    List<Notificacion> findByUsuarioDestinoOrderByFechaCreacionDesc(String usuario);
}

