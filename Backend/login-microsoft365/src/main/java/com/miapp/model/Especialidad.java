package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ESPECIALIDAD",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_ESPECIALIDAD_CODIGO", columnNames = {"CODIGO_ESPECIALIDAD"})
        })
public class Especialidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDESPECIALIDAD")
    private Long idEspecialidad;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDPROGRAMA", nullable = false)
    private Programa programa;

    @Column(name = "CODIGO_ESPECIALIDAD", length = 20, nullable = false)
    private String codigoEspecialidad;

    @Column(name = "DESCRIPCION", length = 200, nullable = false)
    private String descripcion;

    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo = true;
}