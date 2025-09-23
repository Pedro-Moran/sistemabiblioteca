package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DETALLEPRESTAMOEQUIPO")
public class DetallePrestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_detalle_prestamo")
    @SequenceGenerator(
            name = "seq_detalle_prestamo",
            sequenceName = "SEQ_DETALLE_PRESTAMO",
            allocationSize = 1
    )
    @Column(name = "IDDETALLEPRESTAMOEQUIPO")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "IDEQUIPOLABORATORIO")
    private Equipo equipo;

    @Column(name = "TIPOUSUARIO")
    private Integer tipoUsuario;

    @Column(name = "CODIGOUSUARIO")
    private String codigoUsuario;

    @Column(name = "CODIGOSEDE")
    private String codigoSede;

    @Column(name = "CODIGOSEMESTRE")
    private String codigoSemestre;

    @Column(name = "CODIGOPROGRAMA")
    private String codigoPrograma;

    @Column(name = "CODIGOESCUELA")
    private String codigoEscuela;

    @Column(name = "CODIGOTURNO")
    private String codigoTurno;

    @Column(name = "CODIGOCICLO")
    private String codigoCiclo;

    @Column(name = "FECHASOLICITUD")
    private LocalDateTime fechaSolicitud;

    @Column(name = "FECHAPRESTAMO")
    private LocalDateTime fechaPrestamo;

    @Column(name = "USUARIOPRESTAMO")
    private String usuarioPrestamo;

    @Column(name = "FECHARECEPCION")
    private LocalDateTime fechaRecepcion;

    @Column(name = "USUARIORECEPCION")
    private String usuarioRecepcion;

    @Column(name = "USUARIOCREACION")
    private String usuarioCreacion;

    @Column(name = "FECHACREACION")
    private LocalDateTime fechaCreacion;

    @Column(name = "USUARIOMODIFICACION")
    private String usuarioModificacion;

    @Column(name = "FECHAMODIFICACION")
    private LocalDateTime fechaModificacion;

    @Column(name = "USUARIOCANCELACION")
    private String usuarioCancelacion;

    @Column(name = "FECHACANCELACION")
    private LocalDateTime fechaCancelacion;

    // resto de campos, recepción, auditoría…
    @ManyToOne @JoinColumn(name = "IDESTADO")
    private Estado estado;

    @Enumerated(EnumType.STRING)
    @Column(name="TIPOPRESTAMO")
    private TipoPrestamo tipoPrestamo;

    @Column(name="FECHA_INICIO", nullable=false)
    private LocalDateTime fechaInicio;

    @Column(name="FECHA_FIN", nullable=true)
    private LocalDateTime fechaFin;

    // Flags para evitar reenvíos repetidos
    private boolean reminder72Sent = false;
    private boolean reminder48Sent = false;
}
