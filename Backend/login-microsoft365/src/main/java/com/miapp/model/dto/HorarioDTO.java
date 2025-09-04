package com.miapp.model.dto;

import com.miapp.model.Horario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HorarioDTO {
    private Long id;
    private String descripcion;
    private Long estadoId;
    private String estadoDescripcion;
    private Long sedeId;
    private String sedeDescripcion; 
    private String usuarioCreacion;
    private String usuarioModificacion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;

    public static HorarioDTO fromEntity(Horario h) {
        HorarioDTO d = new HorarioDTO();
        d.setId(h.getId());
        d.setDescripcion(h.getDescripcion());
        d.setEstadoId(h.getEstado().getIdEstado());
        d.setEstadoDescripcion(h.getEstado().getDescripcion());
        if (h.getSede() != null) {
            d.setSedeId(h.getSede().getId());
            d.setSedeDescripcion(h.getSede().getDescripcion());
        }
        return d;
    }
}

