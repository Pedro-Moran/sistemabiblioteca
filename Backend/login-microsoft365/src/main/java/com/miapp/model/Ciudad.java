package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "CIUDAD")
public class Ciudad {
    @Id
    @Column(name = "CODIGOCIUDAD", length = 5)
    private String codigoCiudad;
    @Column(name = "NOMBRECIUDAD")
    private String nombreCiudad;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAISID", nullable = false)
    private Pais pais;
}
