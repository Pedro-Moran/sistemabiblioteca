package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="TIPO_RECURSO_DIGITAL")
@Data
public class TipoRecursoDigital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TIPO")
    private Long id;

    @Column(name = "DESCRIPCION", length = 255, nullable = false)
    private String descripcion;

}

