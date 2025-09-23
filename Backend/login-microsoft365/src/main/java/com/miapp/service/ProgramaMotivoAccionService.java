package com.miapp.service;

import com.miapp.model.ProgramaMotivoAccion;
import com.miapp.repository.ProgramaMotivoAccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgramaMotivoAccionService {

    private final ProgramaMotivoAccionRepository repository;

    public void validarReservaPermitida(String estadoPrograma, String motaccion) {
        if (!StringUtils.hasText(estadoPrograma) || !StringUtils.hasText(motaccion)) {
            return;
        }

        String estado = estadoPrograma.trim();
        String motivo = motaccion.trim();

        Optional<ProgramaMotivoAccion> restriccion = repository
                .findFirstByEstadoProgramaIgnoreCaseAndMotivoAccionIgnoreCaseAndActivoTrue(estado, motivo);

        restriccion.ifPresent(actual -> {
            String mensaje = StringUtils.hasText(actual.getAdvertencia())
                    ? actual.getAdvertencia()
                    : actual.getDescripcion();
            if (!StringUtils.hasText(mensaje)) {
                mensaje = "El usuario no cuenta con acceso para registrar reservas.";
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, mensaje);
        });
    }
}