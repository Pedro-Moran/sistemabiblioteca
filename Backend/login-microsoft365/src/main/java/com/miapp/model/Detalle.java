package com.miapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "DETALLE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Detalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Sede, TipoMaterial y TipoAdquisicion (suponiendo que existen)
    @ManyToOne
    @JoinColumn(name="sede_id")
    private Sede sede;

    @ManyToOne
    @JoinColumn(name="tipo_material_id")
    private TipoMaterial tipoMaterial;

    @ManyToOne
    @JoinColumn(name="tipo_adquisicion_id")
    private TipoAdquisicion tipoAdquisicion;

    @Temporal(TemporalType.DATE)
    private Date fechaIngreso;

    private BigDecimal costo;
    private String numeroFactura;
    private String portadaLibroImg;  // Se guarda la URL de la imagen

    @ManyToOne
    @JoinColumn(name = "material_bibliografico_id")
    @JsonBackReference  // Evita la recursión al serializar el material
    private MaterialBibliografico materialBibliografico;
}

