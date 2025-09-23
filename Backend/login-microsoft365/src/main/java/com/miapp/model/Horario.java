package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="HORARIOSBIBLIOTECA")
@SequenceGenerator(
        name="horarioSeq",
        sequenceName="HORARIOS_SEQ",
        allocationSize=1
)
@Data
public class Horario {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "horarioSeq"
    )
    @Column(name="IDHORARIO")
    private Long id;

    @Column(name="DESCRIPCION", length=255, nullable=false)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ESTADO", nullable = false)
    private Estado estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SEDE")
    private Sede sede;                  // nueva relación

    @Column(name="USUARIOCREACION", length=100)
    private String usuarioCreacion;

    @Column(name="USUARIOMODIFICACION", length=100)
    private String usuarioModificacion;

    @Column(name="FECHACREACION", columnDefinition="TIMESTAMP")
    private LocalDateTime fechaCreacion;

    @Column(name="FECHAMODIFICACION", columnDefinition="TIMESTAMP")
    private LocalDateTime fechaModificacion;
}

