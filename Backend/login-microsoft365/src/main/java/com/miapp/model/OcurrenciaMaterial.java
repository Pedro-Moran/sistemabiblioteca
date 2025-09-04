package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "OCURRENCIA_MATERIAL")
@SequenceGenerator(
        name = "seqOcurrenciaMaterial",          // nombre interno en JPA para el generador
        sequenceName = "OCURRENCIA_MATERIAL_SEQ",// nombre de la secuencia en Oracle
        allocationSize = 1                       // incrementos de 1 para que coincida con Oracle
)
public class OcurrenciaMaterial {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,   // usa SEQUENCE
            generator = "seqOcurrenciaMaterial"   // al que acabas de definir arriba
    )
    private Long id;

    @Column(name = "idocurrencia")
    private Long idocurrencia;

    @Column(name = "id_equipo_laboratorio")
    private Long idEquipoLaboratorio;

    @Column(name = "ES_BIBLIOTECA")
    private Boolean esBiblioteca;

    @Column
    private Integer cantidad;

    @Column(name="CostoUnitario")
    private BigDecimal costoUnitario;

    @Column(name="SubTotal")
    private BigDecimal subTotal;
}

