package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa la relación entre un estado de programa y un motivo de acción
 * que restringe el acceso a las reservas en el portal.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PROGRAMA_MOTIVO_ACCION")
public class ProgramaMotivoAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PROGRAMA_MOTIVO_ACCION")
    private Long id;

    @Column(name = "PROG_ACTION", length = 20, nullable = false)
    private String estadoPrograma;

    @Column(name = "PROG_REASON", length = 20, nullable = false)
    private String motivoAccion;

    @Column(name = "DESCR", length = 200)
    private String descripcion;

    @Column(name = "AD", length = 200)
    private String advertencia;

    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo = Boolean.TRUE;
}