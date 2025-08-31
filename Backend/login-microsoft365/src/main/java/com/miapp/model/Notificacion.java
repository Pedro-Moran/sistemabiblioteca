package com.miapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data            // genera getters, setters, toString, equals, hashCode…
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "NOTIFICACION")
@SequenceGenerator(
        name="seq_notificacion",
        sequenceName="SEQ_NOTIFICACION",  // o el nombre de tu sequence en Oracle
        allocationSize=1
)
public class Notificacion {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seq_notificacion"
    )
    @Column(name="ID")
    private Long id;

    @Column(name="USUARIO")
    private String usuarioDestino;

    private String mensaje;

    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion;

    // si usas NUMBER(1):
    @Column(name="LEIDO")
    private Boolean leida;
}


