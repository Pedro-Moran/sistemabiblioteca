package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PROGRAMA")
public class Programa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROGRAMA")
    private Long idPrograma;

    private String descripcion;

    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo = true;
}
