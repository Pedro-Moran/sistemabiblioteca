package com.miapp.service;

import com.miapp.model.VisitaBibliotecaVirtual;
import com.miapp.repository.VisitaBibliotecaVirtualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VisitaBibliotecaVirtualService {

    private final VisitaBibliotecaVirtualRepository repository;

    public VisitaBibliotecaVirtual registrar(String codigoUsuario, Integer estado) {
        LocalDateTime now = LocalDateTime.now();
        VisitaBibliotecaVirtual visita = new VisitaBibliotecaVirtual();
        visita.setId(repository.findMaxId() + 1);
        visita.setCodigoUsuario(codigoUsuario);
        visita.setEstado(estado);
        visita.setFechaRegistro(now);
        if (estado != null && estado == 1) {
            visita.setHoraIngreso(now);
        } else {
            visita.setHoraSalida(now);
        }
        return repository.save(visita);
    }
}
