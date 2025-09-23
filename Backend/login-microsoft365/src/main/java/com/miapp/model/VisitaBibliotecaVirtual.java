package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "VISITASBIBVIR")
public class VisitaBibliotecaVirtual {

    @Id
    @Column(name = "IDVISITABIBVIR")
    private Long id;

    @Column(name = "CODIGOUSUARIO", nullable = false, length = 10)
    private String codigoUsuario;

    @Column(name = "FLGUSUARIO", nullable = false)
    private Integer estado;

    @Column(name = "HORAINGRESO")
    private LocalDateTime horaIngreso;

    @Column(name = "HORASALIDA")
    private LocalDateTime horaSalida;

    @Column(name = "FECHAREGISTRO")
    private LocalDateTime fechaRegistro;
}
