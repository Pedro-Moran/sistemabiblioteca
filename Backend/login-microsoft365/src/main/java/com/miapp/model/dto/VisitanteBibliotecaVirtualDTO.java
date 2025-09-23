package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para reporte de visitantes de biblioteca virtual */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitanteBibliotecaVirtualDTO {
    private String sede;
    private String baseDatos;
    private String codigo;
    private String apellidosNombres;
    private String tipoUsuario;
    private String especialidad;
    private String programa;
    private String ciclo;
    private String correo;
    private Long   totalVisitas;
    /** Total de inicios de sesión registrados para el usuario dentro del rango consultado. */
    private Long   totalSesiones;

    public Long getTotalSesiones() {
        return totalSesiones;
    }

    public void setTotalSesiones(Long totalSesiones) {
        this.totalSesiones = totalSesiones;
    }
}