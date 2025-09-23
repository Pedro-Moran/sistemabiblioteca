package com.miapp.model;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "TIPOBIBLIOTECAVIRTUAL")
public class TipoBiblioteca {
    @Id @Column(name = "IDTIPOBIBVIRTUAL") private Long id;
    @Column(name = "NOMBRE")            private String descripcion;
}