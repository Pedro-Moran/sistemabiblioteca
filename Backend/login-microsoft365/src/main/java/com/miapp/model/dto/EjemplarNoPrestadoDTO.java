package com.miapp.model.dto;

/**
 * DTO para ejemplares que no han sido prestados.
 */
public class EjemplarNoPrestadoDTO {
    private Long idDetalle;
    private String titulo;

    public EjemplarNoPrestadoDTO() {
    }

    public EjemplarNoPrestadoDTO(Long idDetalle, String titulo) {
        this.idDetalle = idDetalle;
        this.titulo = titulo;
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
}