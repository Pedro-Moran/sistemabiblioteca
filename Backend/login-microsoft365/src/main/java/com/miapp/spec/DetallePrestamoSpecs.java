package com.miapp.spec;

import com.miapp.model.DetallePrestamo;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class DetallePrestamoSpecs {

    public static Specification<DetallePrestamo> porSede(String codigoSede) {
        return (root, cq, cb) ->
                codigoSede == null || codigoSede.equals("0")
                        ? cb.conjunction()
                        : cb.equal(root.get("codigoSede"), codigoSede);
    }

    public static Specification<DetallePrestamo> porTipoUsuario(Integer tipoUsuario) {
        return (root, cq, cb) ->
                tipoUsuario == null
                        ? cb.conjunction()
                        : cb.equal(root.get("tipoUsuario"), tipoUsuario);
    }

//    public static Specification<DetallePrestamo> porEstado(String estado) {
//        return (root, cq, cb) -> {
//            if (estado == null || estado.isBlank()) {
//                return cb.conjunction();
//            }
//            String normalized = estado.trim().replace(' ', '_');
//            // Aquí "REPLACE(tipoPrestamo, ' ', '_')" en SQL
//            Expression<String> replaced = cb.function(
//                    "REPLACE",
//                    String.class,
//                    root.get("tipoPrestamo"),
//                    cb.literal(" "),
//                    cb.literal("_")
//            );
//            return cb.equal(replaced, normalized);
//        };
//    }

    public static Specification<DetallePrestamo> porTipoPrestamo(String tipoPrestamo) {
        return (root, cq, cb) -> {
            if (tipoPrestamo == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("tipoPrestamo"), tipoPrestamo);
        };
    }

    public static Specification<DetallePrestamo> porEstadoId(Integer idEstado) {
        return (root, cq, cb) ->
                idEstado == null
                        ? cb.conjunction()
                        : cb.equal(root.get("estado").get("idEstado"), idEstado);
    }

    public static Specification<DetallePrestamo> porEscuela(String codigoEscuela) {
        return (root, cq, cb) ->
                codigoEscuela == null
                        ? cb.conjunction()
                        : cb.equal(root.get("codigoEscuela"), codigoEscuela);
    }

    public static Specification<DetallePrestamo> porPrograma(String codigoPrograma) {
        return (root, cq, cb) ->
                codigoPrograma == null
                        ? cb.conjunction()
                        : cb.equal(root.get("codigoPrograma"), codigoPrograma);
    }

    public static Specification<DetallePrestamo> porCiclo(String codigoCiclo) {
        return (root, cq, cb) ->
                codigoCiclo == null
                        ? cb.conjunction()
                        : cb.equal(root.get("codigoCiclo"), codigoCiclo);
    }

    public static Specification<DetallePrestamo> excluirEstadoDescripcion(String descripcion) {
        return (root, cq, cb) ->
                descripcion == null
                        ? cb.conjunction()
                        : cb.notEqual(
                        cb.upper(root.get("estado").get("descripcion")),
                        descripcion.toUpperCase());
    }

    public static Specification<DetallePrestamo> entreFechas(LocalDateTime inicio, LocalDateTime fin) {
        System.out.println(">> entreFechas: " + inicio + " - " + fin);
        return (root, cq, cb) ->
                cb.between(root.get("fechaInicio"), inicio, fin);
    }

    public static Specification<DetallePrestamo> conFetchEquipoYSede() {
        return (root, cq, cb) -> {
            root.fetch("equipo", JoinType.LEFT).fetch("sede", JoinType.LEFT);
            cq.distinct(true);
            return cb.conjunction();
        };
    }
}
