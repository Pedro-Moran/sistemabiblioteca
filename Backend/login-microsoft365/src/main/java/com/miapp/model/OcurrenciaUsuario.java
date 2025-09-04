package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "OCURRENCIA_USUARIO")
@SequenceGenerator(
        name         = "seqOcurrenciaUsuario",
        sequenceName = "OCURRENCIA_USUARIO_SEQ",
        allocationSize = 1
)
public class OcurrenciaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "seqOcurrenciaUsuario")
    private Long id;

    @Column(name = "IDOCURRENCIA", nullable = false)
    private Long idocurrencia;

    // ÉSTA es la clave: coincide con tu DDL, sin guión bajo
    @Column(name = "CODIGO_USUARIO", nullable = false, length = 50)
    private String codigoUsuario;

    @Column(name = "TIPOUSUARIO", nullable = false)
    private Integer tipoUsuario;
}
