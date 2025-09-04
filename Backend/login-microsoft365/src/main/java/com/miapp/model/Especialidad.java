package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ESPECIALIDAD")
public class Especialidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDESPECIALIDAD")
    private Long idEspecialidad;

    private String descripcion;

    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo = true;
}

