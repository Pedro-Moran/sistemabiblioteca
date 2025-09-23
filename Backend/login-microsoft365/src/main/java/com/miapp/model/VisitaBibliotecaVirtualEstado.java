package com.miapp.model;

/**
 * Constantes que representan los valores almacenados en la columna {@code FLGUSUARIO}
 * de la tabla {@code VISITASBIBVIR}. Permite identificar el origen del registro
 * y si corresponde a un ingreso o salida física.
 */
public final class VisitaBibliotecaVirtualEstado {

    /** Visita presencial registrada como ingreso en el módulo manual. */
    public static final int INGRESO_PRESENCIAL = 1;
    /** Registro de salida presencial. */
    public static final int SALIDA_PRESENCIAL = 2;
    /** Ingreso registrado automáticamente al autenticarse con Microsoft. */
    public static final int INGRESO_VIRTUAL = 3;

    private VisitaBibliotecaVirtualEstado() {
        // Evita la instanciación.
    }

    /**
     * Determina si el estado representa un evento de ingreso.
     *
     * @param estado valor almacenado en {@code FLGUSUARIO}.
     * @return {@code true} si corresponde a un ingreso presencial o virtual, o si el estado es nulo.
     */
    public static boolean esIngreso(Integer estado) {
        return estado == null
                || estado == INGRESO_PRESENCIAL
                || estado == INGRESO_VIRTUAL;
    }

    /**
     * Determina si el estado corresponde a un ingreso virtual.
     *
     * @param estado valor almacenado en {@code FLGUSUARIO}.
     * @return {@code true} si el estado representa un login con Microsoft.
     */
    public static boolean esVirtual(Integer estado) {
        return estado != null && estado == INGRESO_VIRTUAL;
    }
}