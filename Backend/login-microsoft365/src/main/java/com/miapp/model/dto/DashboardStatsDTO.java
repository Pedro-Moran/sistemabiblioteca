package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long materiales;
    private long prestadosMateriales;
    private long equipos;
    private long prestadosEquipos;
    private long usuarios;
    private long nuevosUsuarios;
    private long comentarios;
    private long comentariosRespondidos;
}