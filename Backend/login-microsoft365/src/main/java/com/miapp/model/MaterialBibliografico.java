package com.miapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "MATERIAL_BIBLIOGRAFICO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialBibliografico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;
    private String titulo;
    private String linkPublicacion;
    private String descripcion;
    private String notasContenido;
    private String notaGeneral;

    // Relación con Especialidad (suponiendo que ya tienes la entidad Especialidad)
    @ManyToOne
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    @OneToOne(mappedBy = "materialBibliografico", cascade = CascadeType.ALL)
    @JsonManagedReference  // Serializa Editorial en esta entidad
    private Editorial editorial;

    @OneToMany(mappedBy = "materialBibliografico", cascade = CascadeType.ALL)
    @JsonManagedReference  // Serializa Detalle en este lado
    private List<Detalle> detalles;
}

