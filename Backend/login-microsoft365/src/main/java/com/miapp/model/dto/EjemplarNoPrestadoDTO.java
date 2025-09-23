package com.miapp.model.dto;

/**
 * DTO para ejemplares que no han sido prestados.
 */
public class EjemplarNoPrestadoDTO {
    private Long idDetalle;
    private String titulo;
    private String codigoLocalizacion;
    private Long numeroIngreso;
    private String autor;
    private Integer anio;

    public EjemplarNoPrestadoDTO() {
    }

    public EjemplarNoPrestadoDTO(Long idDetalle,
                                 String titulo,
                                 String codigoLocalizacion,
                                 Long numeroIngreso,
                                 String autor,
                                 Integer anio) {
        this.idDetalle = idDetalle;
        this.titulo = titulo;
        this.codigoLocalizacion = codigoLocalizacion;
        this.numeroIngreso = numeroIngreso;
        this.autor = autor;
        this.anio = anio;
    }

    public Long getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(Long idDetalle) {
        this.idDetalle = idDetalle;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCodigoLocalizacion() {
        return codigoLocalizacion;
    }

    public void setCodigoLocalizacion(String codigoLocalizacion) {
        this.codigoLocalizacion = codigoLocalizacion;
    }

    public Long getNumeroIngreso() {
        return numeroIngreso;
    }

    public void setNumeroIngreso(Long numeroIngreso) {
        this.numeroIngreso = numeroIngreso;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }
}