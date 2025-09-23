package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="NOTICIAS")
@Data
public class Noticia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDNOTICIA")
    private Long idnoticia;

    @Column(name = "TITULAR", length = 255)
    private String titular;

    @Column(name = "SUBTITULO", length = 255)
    private String subtitulo;

    @Column(name = "AUTOR", length = 255)
    private String autor;

    @Lob
    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Lob
    @Column(name = "ENLACE")
    private String enlace;

    @Lob
    @Column(name = "IMAGEN")
    private String imagen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ESTADO", nullable = false)
    private Estado estado;

    @Column(name = "USUARIOCREACION", length = 50)
    private String usuariocreacion;

    @Column(name = "USUARIOMODIFICACION", length = 50)
    private String usuariomodificacion;

    @Column(name = "FECHACREACION", columnDefinition = "TIMESTAMP")
    private LocalDateTime fechacreacion;

    @Column(name = "FECHAMODIFICACION", columnDefinition = "TIMESTAMP")
    private LocalDateTime fechamodificacion;
}