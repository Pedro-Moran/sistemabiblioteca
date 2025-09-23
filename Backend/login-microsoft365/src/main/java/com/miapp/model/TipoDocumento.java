package com.miapp.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TIPODOCUMENTO")
public class TipoDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTIPODOCUMENTO")
    private Long idTipoDocumento;

    private String descripcion;

    @Column(name = "ACTIVO", columnDefinition = "NUMBER(1)")
    private Boolean activo;
}