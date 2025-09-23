package com.miapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BIBLIOTECA")
@SequenceGenerator(
        name = "biblio_seq",
        sequenceName = "SEQ_BIBLIOTECA",
        allocationSize = 1
)
public class Biblioteca {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "biblio_seq")
    @Column(name = "IDBIBLIOTECA")
    private Long id;

    @Column(name = "CODIGOLOCALIZACION", length = 100)
    private String codigoLocalizacion;

    @ManyToOne @JoinColumn(name = "TIPOBIBLIOTECA")
    private TipoBiblioteca tipoBiblioteca;

    @Lob @Column(name = "AUTORPERSONAL")           private String autorPersonal;
    @Lob @Column(name = "AUTORINSTITUCIONAL")     private String autorInstitucional;
    @Column(name = "AUTORSECUNDARIO", length = 300) private String autorSecundario;
    @Column(name = "TRADUCTOR", length = 300)      private String traductor;
    @Column(name = "DIRECTOR", length = 300)       private String director;
    @Column(name = "COMPILADOR", length = 300)     private String compilador;
    @Column(name = "COORDINADOR", length = 200)     private String coordinador;
    @Column(name = "PRODUCTOR", length = 300)      private String productor;

    @Lob @Column(name = "TITULO")                 private String titulo;
    @Column(name = "TITULOANTERIOR", length = 500) private String tituloAnterior;
    @Column(name = "EDITORIALPUBLICACION", length = 500) private String editorialPublicacion;

    @Column(name = "TIPOANIOPUBLICACION")         private Integer tipoAnioPublicacion;
    @Column(name = "ANIOPUBLICACION")             private Integer anioPublicacion;
    @Column(name = "ISBN", length = 100)           private String isbn;
    @Column(name = "ISSN", length = 100)           private String issn;
    @Column(name = "SERIE", length = 500)          private String serie;
    @Column(name = "TIPOREPRODUCCION")             private Integer tipoReproduccion;
    @Column(name = "TIPOCONTEO")                   private Integer tipoConteo;
    @Column(name = "NUMEROCONTEO", length = 50)     private String numeroConteo;
    @Column(name = "NUMEROCONTEO2", length = 50)    private String numeroConteo2;
    @Column(name = "EDICION", length = 500)         private String edicion;
    @Column(name = "REIMPRESION")                  private Integer reimpresion;

    @Lob @Column(name = "DESCRIPTOR")              private String descriptor;
    @Column(name = "DESCRIPCIONREVISTA")           private String descripcionRevista;
    @Lob @Column(name = "NOTACONTENIDO")           private String notaContenido;
    @Lob @Column(name = "NOTAGENERAL")             private String notaGeneral;
    @Lob @Column(name = "NOTARESUMEN")             private String notaResumen;

    @ManyToOne @JoinColumn(name = "CODIGOIDIOMA")
    private Idioma idioma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TIPO_MATERIAL")
    private TipoMaterial tipoMaterial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODIGOPAIS")
    private Pais pais;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODIGOCIUDAD")
    private Ciudad ciudad;

    @ManyToOne @JoinColumn(name = "CODIGOPERIODICIDAD")
    private Periodicidad periodicidad;


    @Column(name = "NUMEROEXPEDIENTE", length = 100) private String numeroExpediente;
    @Column(name = "JUZGADO", length = 300)           private String juzgado;
    @Column(name = "FECHAINICIOEXPEDIENTE")           private LocalDateTime fechaInicioExpediente;

    @Lob @Column(name = "MOTIVO")                   private String motivo;
    @Lob @Column(name = "PROCESO")                  private String proceso;
    @Lob @Column(name = "MATERIA")                  private String materia;
    @Lob @Column(name = "OBSERVACION")              private String observacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDESPECIALIDAD")
    private Especialidad especialidad;
    @Lob @Column(name = "DEMANDADO")                private String demandado;
    @Lob @Column(name = "DEMANDANTE")               private String demandante;

    @Lob @Column(name = "RUTAIMAGEN")               private String rutaImagen;
    @Column(name = "NOMBREIMAGEN", length = 100)     private String nombreImagen;

    @Column(name = "IDESTADO")
    private Long idEstado;

    @Column(name = "FLASYLLABUS")                   private Boolean flasyllabus;
    @Column(name = "FLADIGITALIZADO")               private Boolean fladigitalizado;

    @Lob @Column(name = "LINKPUBLICACION")          private String linkPublicacion;

    // — Campos añadidos según tu listado de imagen —
    @Column(name = "NUMEROPAGINAS")                 private Integer numeroPaginas;
    @Column(name = "NUMERODEINGRESO")               private Long numeroDeIngreso;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDSEDE")
    private Sede sede;
    @ManyToOne @JoinColumn(name = "TIPOADQUISICION")
    private TipoAdquisicion tipoAdquisicion;
    @Column(name = "FECHAINGRESO")                  private LocalDateTime fechaIngreso;
    @Column(name = "COSTO")                         private BigDecimal costo;
    @Column(name = "NUMEROFACTURA", length = 100)    private String numeroFactura;
    @Column(name = "EXISTENCIAS")                   private Integer existencias;

    @Column(name = "USUARIOCREACION", length = 30)   private String usuarioCreacion;
    @Column(name = "FECHACREACION")                 private LocalDateTime fechaCreacion;
    @Column(name = "USUARIOMODIFICACION", length = 30) private String usuarioModificacion;
    @Column(name = "FECHAMODIFICACION")             private LocalDateTime fechaModificacion;
    @OneToMany(mappedBy = "biblioteca",
            cascade = CascadeType.ALL,   // ➜ inserta / actualiza / borra los detalles
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<DetalleBiblioteca> detalles = new ArrayList<>();
    @OneToMany(mappedBy = "biblioteca",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<BibliotecaCiclo> ciclos = new ArrayList<>();
}
