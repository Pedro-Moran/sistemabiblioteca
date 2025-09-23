package com.miapp.model;

public enum TipoPrestamo {
    EN_SALA("PRESTADO EN SALA"),
    PRESTAMO_A_DOMICILIO("PRESTAMO A DOMICILIO"),
    SALA_Y_DOMICILIO("PRESTADO EN SALA Y DOMICILIO");

    private final String estadoDesc;
    TipoPrestamo(String estadoDesc) { this.estadoDesc = estadoDesc; }
    public String getEstadoDesc() { return estadoDesc; }
}
