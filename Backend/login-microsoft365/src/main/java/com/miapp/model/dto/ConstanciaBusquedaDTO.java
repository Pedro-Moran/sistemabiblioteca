package com.miapp.model.dto;

public class ConstanciaBusquedaDTO {
    private Long id;
    private String codigo;
    private String estudiante;
    private String especialidad;
    private String sede;
    private boolean pendiente;

    public ConstanciaBusquedaDTO(Long id, String codigo, String estudiante, String especialidad, String sede, boolean pendiente) {
        this.id = id;
        this.codigo = codigo;
        this.estudiante = estudiante;
        this.especialidad = especialidad;
        this.sede = sede;
        this.pendiente = pendiente;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getEstudiante() { return estudiante; }
    public String getEspecialidad() { return especialidad; }
    public String getSede() { return sede; }
    public boolean isPendiente() { return pendiente; }
}