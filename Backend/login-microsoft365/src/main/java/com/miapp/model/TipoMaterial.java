package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TIPO_MATERIAL")
public class TipoMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TIPO_MATERIAL")
    private Long idTipoMaterial;

    @Column(name = "DESCRIPCION", length = 100, nullable = false)
    private String descripcion;

    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo;
}
