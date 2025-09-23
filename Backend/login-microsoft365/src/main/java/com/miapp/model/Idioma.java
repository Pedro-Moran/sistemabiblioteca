package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "IDIOMA")
public class Idioma {
    @Id @Column(name = "IDIDIOMA")           private Long id;
    @Column(name = "NOMBRE")                 private String nombre;
    @Column(name = "CODIGO_ISO")             private String codigoIso;
}
