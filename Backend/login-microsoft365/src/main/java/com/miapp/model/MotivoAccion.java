package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MOTIVO_ACCION")
public class MotivoAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDMOTIVOACCION")
    private Long idMotivoAccion;

    @Column(name = "DESCRIPCION", length = 100, nullable = false)
    private String descripcion;

    @Column(name = "ESTADO", columnDefinition = "NUMBER(1)")
    private Boolean estado = true;
}