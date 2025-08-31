package com.miapp.model.dto;

public class EjemplarPrestadoDTO {
    private Long idDetalle;
    private String titulo;
    private Integer totalPrestamos;

    public EjemplarPrestadoDTO() {
    }

    public EjemplarPrestadoDTO(Long idDetalle, String titulo, Integer totalPrestamos) {
        this.idDetalle = idDetalle;
        this.titulo = titulo;
        this.totalPrestamos = totalPrestamos;
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
}