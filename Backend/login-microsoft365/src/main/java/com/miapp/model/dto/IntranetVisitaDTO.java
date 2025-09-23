package com.miapp.model.dto;

import java.time.LocalDateTime;

/**
 * DTO que representa una visita a la intranet de biblioteca.
 */
public record IntranetVisitaDTO(
        String tipoUsuario,
        String subTipoUsuario,
        String programa,
        String pacpro,
        String idVisitaBibVir,
        String idSituacionAlumno,
        String idBibVir,
        String horaSalida,
        String horaIngreso,
        String flgUsuario,
        LocalDateTime fechaRegistro,
        String codigoUsuario,
        String codigoSede,
        String codigoEspecialidad,
        String ciclo,
        long totalVisitas
) {}