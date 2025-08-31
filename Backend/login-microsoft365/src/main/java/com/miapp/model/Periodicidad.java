package com.miapp.model;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "PERIODICIDAD")
public class Periodicidad {
    @Id @Column(name = "CODIGOPERIODICIDAD") private Long id;
    @Column(name = "DESCRIPCION")             private String descripcion;
}
