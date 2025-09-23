package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ESTADO")
public class Estado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDESTADO")
    private Long idEstado;

    private String descripcion;

    // Puedes tener un campo 'activo' si lo requieres
    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo;
}
