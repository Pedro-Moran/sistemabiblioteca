package com.miapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "EDITORIAL")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Editorial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String autorPersonal;
    private String autorSecundario;
    private String autorInstitucional;
    private String editorial;
    private String coordinador;
    private String director;
    private String compilador;
    private String serie;
    private String descripcionFisica;
    private Integer cantidad;
    private Integer anioPublicacion;
    private String edicion;
    private String reimpresion;
    private String isbn;

    // Relaciones con Pais, Ciudad, Idioma (asumiendo que existen)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODIGOPAIS", nullable = false)
    private Pais pais;

    @ManyToOne
    @JoinColumn(name = "CODIGOCIUDAD", referencedColumnName = "CODIGOCIUDAD")
    private Ciudad ciudad;

    @ManyToOne
    @JoinColumn(name = "idioma_id")
    private Idioma idioma;

    @OneToOne
    @JoinColumn(name = "material_bibliografico_id")
    @JsonBackReference  // No serializa la parte del material para evitar recursión
    private MaterialBibliografico materialBibliografico;
}

