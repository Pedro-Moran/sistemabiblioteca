package com.miapp.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "EQUIPO_COMPUTO")
public class EquipoComputo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_EQUIPO")
    private Long idEquipo;

    @Column(name = "NOMBRE_EQUIPO", length = 100)
    private String nombreEquipo;

    @Column(name = "NUMERO_EQUIPO", length = 50)
    private String numeroEquipo;

    @Column(name = "ID_SEDE")
    private Long idSede;

    @Column(name = "ESTADO", length = 50)
    private String estado;

    @Column(name = "FECHA_INGRESO")
    private LocalDate fechaIngreso;

    @Column(name = "IP", length = 150)
    private String ip;

    @Column(name = "DISCAPACIDAD", length = 4)
    private String discapacidad;

    @Column(name = "FECHA_CREACION")
    private LocalDate fechaCreacion;

    @Column(name = "USUARIO_CREACION", length = 50)
    private String usuarioCreacion;

    @Column(name = "FECHA_MODIFICACION")
    private LocalDate fechaModificacion;

    @Column(name = "USUARIO_MODIFICACION", length = 50)
    private String usuarioModificacion;
}