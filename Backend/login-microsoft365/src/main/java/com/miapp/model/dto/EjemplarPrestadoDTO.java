package com.miapp.model.dto;

public class EjemplarPrestadoDTO {
    private Long idDetalle;
    private String titulo;
    private Integer totalPrestamos;
    private Integer ciclo;
    private String codigoLocalizacion;
    private Long numeroIngreso;
    private Integer anio;
    private String autor;

    public EjemplarPrestadoDTO() {
    }

    public EjemplarPrestadoDTO(Long idDetalle,
                               String titulo,
                               Integer totalPrestamos,
                               Integer ciclo,
                               String codigoLocalizacion,
                               Long numeroIngreso,
                               Integer anio,
                               String autor) {
        this.idDetalle = idDetalle;
        this.titulo = titulo;
        this.totalPrestamos = totalPrestamos;
        this.ciclo = ciclo;
        this.codigoLocalizacion = codigoLocalizacion;
        this.numeroIngreso = numeroIngreso;
        this.anio = anio;
        this.autor = autor;
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

    public Integer getTotalPrestamos() {
        return totalPrestamos;
    }

    public void setTotalPrestamos(Integer totalPrestamos) {
        this.totalPrestamos = totalPrestamos;
    }

    public Integer getCiclo() {
        return ciclo;
    }

    public void setCiclo(Integer ciclo) {
        this.ciclo = ciclo;
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

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }
}