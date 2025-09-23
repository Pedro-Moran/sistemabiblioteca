package com.miapp.model;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "TIPO_ADQUISICION")
public class TipoAdquisicion {
    @Id @Column(name = "ID")       private Long id;
    @Column(name = "DESCRIPCION")  private String descripcion;
}