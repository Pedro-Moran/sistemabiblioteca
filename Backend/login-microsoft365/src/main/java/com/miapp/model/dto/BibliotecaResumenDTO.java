package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de “resumen” de Biblioteca.
 * Incluye todos los campos posibles de tu entidad Biblioteca, para que puedas
 * elegir (comentando/quedando contigo solo los que quieras mostrar en la cabecera).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BibliotecaResumenDTO {
    /** 1) ID de la biblioteca */
    private Long id;

    /** 2) Código de localización */
    private String codigoLocalizacion;

    /** 3) Tipo de biblioteca (FK a TipoBiblioteca) */
    private Long tipoBibliotecaId;

    /** 4) Autor personal */
    private String autorPersonal;

    /** 5) Autor institucional */
    private String autorInstitucional;

    /** 6) Autor secundario */
    private String autorSecundario;

    /** 7) Traductor */
    private String traductor;

    /** 8) Director */
    private String director;

    /** 9) Coordinador */
    private String coordinador;

    /** 10) Compilador */
    private String compilador;

    /** 11) Productor */
    private String productor;

    /** 12) Título */
    private String titulo;

    /** 13) Título anterior */
    private String tituloAnterior;

    /** 14) Editorial de publicación */
    private String editorialPublicacion;

    /** 15) Tipo de año de publicación (Integer) */
    private Integer tipoAnioPublicacion;

    /** 16) Año de publicación */
    private Integer anioPublicacion;

    /** 17) ID de especialidad (FK a Especialidad) */
    private Long idEspecialidad;

    /** 18) ISBN */
    private String isbn;

    /** 19) ISSN */
    private String issn;

    /** 20) Serie */
    private String serie;

    /** 21) Tipo de reproducción (Integer) */
    private Integer tipoReproduccion;

    /** 22) Tipo de conteo (Integer) */
    private Integer tipoConteo;

    /** 23) Número de conteo (String) */
    private String numeroConteo;

    /** 24) Número de conteo 2 (String) */
    private String numeroConteo2;

    /** 25) Edición (String) */
    private String edicion;

    /** 26) Reimpresión (Integer) */
    private Integer reimpresion;

    /** 27) Descriptor (LOB) */
    private String descriptor;

    private String descripcionRevista;

    /** 28) Nota de contenido (LOB) */
    private String notaContenido;

    /** 29) Nota general (LOB) */
    private String notaGeneral;

    /** 30) Nota resumen (LOB) */
    private String notaResumen;

    /** 31) ID de idioma (FK a Idioma) */
    private Long idiomaId;

    /** 32) Código de país (FK a Pais) */
    private String paisId;

    /** 33) Código de ciudad (FK a Ciudad) */
    private String ciudadCodigo;

    /** 34) ID de periodicidad (FK a Periodicidad) */
    private Long periodicidadId;

    /** 35) Número de expediente (String) */
    private String numeroExpediente;

    /** 36) Juzgado (String) */
    private String juzgado;

    /** 37) Fecha de inicio de expediente (LocalDateTime) */
    private LocalDateTime fechaInicioExpediente;

    /** 38) Motivo (LOB) */
    private String motivo;

    /** 39) Proceso (LOB) */
    private String proceso;

    /** 40) Materia (LOB) */
    private String materia;

    /** 41) Observación (LOB) */
    private String observacion;

    /** 42) Demandado (LOB) */
    private String demandado;

    /** 43) Demandante (LOB) */
    private String demandante;

    /** 44) Ruta de la imagen (String) */
    private String rutaImagen;

    /** 45) Nombre de la imagen (String) */
    private String nombreImagen;

    /** 46) ID de estado (1=en proceso, 2=disponible, 3=reservado, etc.) */
    private Long estadoId;

    /** 46b) Descripción textual del estado */
    private String estadoDescripcion;

    /** 47) Flag si tiene syllabus */
    private Boolean flasyllabus;

    /** 48) Flag si está digitalizado */
    private Boolean fladigitalizado;

    /** 49) Link de publicación (String) */
    private String linkPublicacion;

    /** 50) Número de páginas */
    private Integer numeroPaginas;

    /** 51) Número de ingreso (Long, lo genera BD) */
    private Long numeroDeIngreso;

    /** 52) ID de sede (FK a Sede) */
    private Long sedeId;

    /** 53) ID de tipo de adquisición (FK a TipoAdquisicion) */
    private Long tipoAdquisicionId;

    /** 54) Fecha de ingreso (LocalDateTime) */
    private LocalDateTime fechaIngreso;

    /** 55) Costo (BigDecimal) */
    private BigDecimal costo;

    /** 56) Número de factura (String) */
    private String numeroFactura;

    /** 57) Existencias (Integer) */
    private Integer existencias;

    /** 58) Usuario que creó el registro (String) */
    private String usuarioCreacion;

    /** 59) Fecha de creación del registro (LocalDateTime) */
    private LocalDateTime fechaCreacion;

    /** 60) Usuario de última modificación (String) */
    private String usuarioModificacion;

    /** 61) Fecha de última modificación (LocalDateTime) */
    private LocalDateTime fechaModificacion;

    /** 62) ID de tipo de material (FK a TipoMaterial) */
    private Long tipoMaterialId;
}
