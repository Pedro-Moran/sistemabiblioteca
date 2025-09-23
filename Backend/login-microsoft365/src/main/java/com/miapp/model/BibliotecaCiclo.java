package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BIBLIOTECACICLO")
public class BibliotecaCiclo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "biblio_ciclo_seq")
    @SequenceGenerator(name = "biblio_ciclo_seq", sequenceName = "SEQ_BIBLIOTECACICLO", allocationSize = 1)
    @Column(name = "IDBIBLIOTECACICLO")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDBIBLIOTECAESPECIALIDAD", referencedColumnName = "IDBIBLIOTECA")
    private Biblioteca biblioteca;

    @Column(name = "IDCICLO")
    private Integer ciclo;

    @Column(name = "IDESTADO")
    private Long idEstado;
}