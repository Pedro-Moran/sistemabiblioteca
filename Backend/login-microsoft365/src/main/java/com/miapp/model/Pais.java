package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "PAIS")
public class Pais {
    @Id
    @Column(name = "PAISID", length = 20)
    private String paisId;
    @Column(name = "CODIGOPAIS", length = 5) private String codigoPais;
    @Column(name = "NOMBPAIS")                private String nombrePais;
}