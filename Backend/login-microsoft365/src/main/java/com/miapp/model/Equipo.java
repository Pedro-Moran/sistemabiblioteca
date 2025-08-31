package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "EQUIPOLABORATORIO")
public class Equipo {
    @Id
    @Column(name = "IDEQUIPOLABORATORIO")
    @SequenceGenerator(
            name = "seq_equipolaboratorio",
            sequenceName = "SEQ_EQUIPOLABORATORIO",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seq_equipolaboratorio"
    )
    private Long idEquipo;

    @Column(name = "NOMBREEQUIPO")
    private String nombreEquipo;

    @Column(name = "NUMEROEQUIPO")
    private Long numeroEquipo;

    @Column(name = "NUMEROIP")
    private String ip;

    @ManyToOne
    @JoinColumn(name = "IDESTADO")
    private Estado estado;

    @Column(name = "EQUIPO_DISCAPACIDAD")
    private Boolean equipoDiscapacidad;

    // Relación con la sede (otra tabla)
    @ManyToOne
    @JoinColumn(name = "IDSEDE")
    private Sede sede;

    @Column(name = "HORA_INICIO", length = 30)
    private String horaInicio;     // almacenaremos algo como "09:00"

    @Column(name = "HORA_FIN", length = 30)
    private String horaFin;        // almacenaremos algo como "12:00"

    @Column(name = "MAX_HORAS")
    private Integer maxHoras;
}

