package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ROLUSUARIO")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rol_seq")
    @SequenceGenerator(name = "rol_seq", sequenceName = "ROLUSUARIO_SEQ", allocationSize = 1)
    @Column(name = "IDROL")
    private Long idRol;

    @Column(nullable = false, unique = true)
    private String descripcion;
}
