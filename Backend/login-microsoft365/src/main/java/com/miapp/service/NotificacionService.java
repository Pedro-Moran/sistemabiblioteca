package com.miapp.service;

import com.miapp.model.Notificacion;
import com.miapp.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {
    private final NotificacionRepository repo;

    public void crearNotificacion(String usuario, String mensaje) {
        System.out.println("ver desde service notificacion: "+ usuario);
        Notificacion n = new Notificacion();
        n.setUsuarioDestino(usuario);
        n.setMensaje(mensaje);
        n.setFechaCreacion(LocalDateTime.now());
        n.setLeida(false);
        repo.save(n);
    }

    public List<Notificacion> listarNoLeidas(String usuario) {
        return repo.findByUsuarioDestinoAndLeidaFalse(usuario);
    }

    public List<Notificacion> listarTodas(String usuario) {
        return repo.findByUsuarioDestinoOrderByFechaCreacionDesc(usuario);
    }

    public void marcarLeida(Long id) {
        Notificacion n = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        n.setLeida(true);
        // no vuelvas a tocar fechaCreacion aquí
        repo.save(n);
    }
}
