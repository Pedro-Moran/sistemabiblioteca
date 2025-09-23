package com.miapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "OCURRENCIABIBLIOTECA")
public class OcurrenciaBiblioteca {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_ocurrencia_biblio")
    @SequenceGenerator(
            name          = "seq_ocurrencia_biblio",
            sequenceName  = "SEQ_OCURRENCIA_BIBLIO",
            allocationSize= 1
    )
    @Column(name = "IDOCURRENCIA")
    private Long id;

    /** Relación con detalle de préstamo de equipo */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name               = "IDDETALLEPRESTAMO",
            referencedColumnName = "IDDETALLEPRESTAMOEQUIPO",
            nullable           = true
    )
    private DetallePrestamo detallePrestamo;

    /** Relación con detalle de biblioteca */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name               = "IDDETALLEBIBLIOTECA",
            referencedColumnName = "IDDETALLEBIBLIOTECA"
    )
    private DetalleBiblioteca detalleBiblioteca;

    /** Código de localización (50) */
    @Column(name = "CODIGOLOCALIZACION", length = 50)
    private String codigoLocalizacion;

    /** Código de usuario */
    @Column(name = "CODIGOUSUARIO", length = 50)
    private String codigoUsuario;

    /** Costo de la ocurrencia */
    @Column(name = "COSTO", precision = 18, scale = 2)
    private BigDecimal costo;

    /** Descripción de la auditoría */
    @Column(name = "DESCRIPCION", length = 500)
    private String descripcion;

    /** Descripción para regularización */
    @Column(name = "DESCRIPCIONREGULARIZA", length = 500)
    private String descripcionRegulariza;

    /** Estado del costo */
    @Column(name = "ESTADOCOSTO")
    private Integer estadoCosto;

    /** Fecha en que se generó el costo */
    @Column(name = "FECHACOSTO")
    private LocalDateTime fechaCosto;

    /** Fecha de creación de la ocurrencia */
    @Column(name = "FECHACREACION")
    private LocalDateTime fechaCreacion;

    /** Fecha de última modificación */
    @Column(name = "FECHAMODIFICACION")
    private LocalDateTime fechaModificacion;

    /** Fecha en que ocurrió el evento */
    @Column(name = "FECHAOCURRENCIA")
    private LocalDateTime fechaOcurrencia;

    /** Fecha original del préstamo */
    @Column(name = "FECHAPRESTAMO")
    private LocalDateTime fechaPrestamo;

    /** Si hay un préstamo asociado a nivel general */
    @Column(name = "IDPRESTAMO")
    private Long idPrestamo;

    /** Monto realmente pagado */
    @Column(name = "MONTOPAGADO", precision = 18, scale = 2)
    private BigDecimal montoPagado;

    /** Número de ingreso automágico */
    @Column(name = "NROINGRESO")
    private Long nroIngreso;

    /** Número de pago secuencial */
    @Column(name = "NUMPAGO")
    private Long numeroPago;

    /** PACPRO */
    @Column(name = "PACPRO", length = 5)
    private String pacPro;

    /** Flag de regularización */
    @Column(name = "REGULARIZA")
    private Integer regulariza;

    /** Relacionar sede de préstamo */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name               = "SEDEPRESTAMO",
            referencedColumnName = "ID"   // o bien la PK de tu tabla SEDE
    )
    private Sede sedePrestamo;

    /** Usuario que generó el costo */
    @Column(name = "USUARIOCOSTO", length = 30)
    private String usuarioCosto;

    /** Usuario creación de la ocurrencia */
    @Column(name = "USUARIOCREACION", length = 30)
    private String usuarioCreacion;

    /** Usuario última modificación */
    @Column(name = "USUARIOMODIFICACION", length = 30)
    private String usuarioModificacion;

    /** Usuario del préstamo */
    @Column(name = "USUARIOPRESTAMO", length = 30)
    private String usuarioPrestamo;

    /** Usuarios de sede EC / EM */
    @Column(name = "USUARIOSEDEC", length = 2)
    private String usuarioSedEc;

    @Column(name = "USUARIOSEDEM", length = 2)
    private String usuarioSedEm;

    /** Abonos y anulados (si los necesitas) */
    @Column(name = "ABONO")
    private BigDecimal abono;

    @Column(name = "ANULADO")
    private Integer anulado;
}
