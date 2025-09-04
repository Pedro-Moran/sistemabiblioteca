package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "RECURSOSDIGITALES")
@Data
public class RecursoDigital {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "recSeq")
    @SequenceGenerator(name = "recSeq",
            sequenceName = "RECURSOSDIGITALES_SEQ",
            allocationSize = 1)
    @Column(name="IDRECURSO")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TIPO")
    private TipoRecursoDigital tipo;

    @Column(name = "AUTOR", length = 255)
    private String autor;

    @Column(name = "TITULO", length = 255, nullable = false)
    private String titulo;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Lob
    @Column(name = "ENLACE")
    private String enlace;

    /** ESTADO = 1 activo, 0 inactivo */
    @Column(name = "ESTADO")
    private Integer estado;

    @Column(name = "USUARIOCREACION", length = 50)
    private String usuarioCreacion;

    @Column(name = "USUARIOMODIFICACION", length = 50)
    private String usuarioModificacion;

    @Column(name = "FECHACREACION")
    private LocalDateTime fechaCreacion;

    @Column(name = "FECHAMODIFICACION")
    private LocalDateTime fechaModificacion;

    @Lob
    @Column(name = "IMAGEN")
    private String imagen; // base64 o URL

    @Column(name = "CLICKS")
    private Long clicks;
}
