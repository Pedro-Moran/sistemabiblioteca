package com.miapp.service;

import com.miapp.model.MaterialBibliografico;
import org.springframework.data.jpa.domain.Specification;

public class MaterialBibliograficoSpecification {

    public static Specification<MaterialBibliografico> filtro(String campo, String valor) {
        return (root, query, builder) -> {
            if (campo == null || valor == null || valor.isEmpty()) {
                return builder.conjunction(); // No aplica filtro
            }
            // Algunos campos están mapeados como CLOB en la base de datos y las funciones
            // SQL como LOWER no aceptan directamente este tipo. Se convierte el valor a
            // cadena usando la función SQL TO_CHAR antes de aplicar LOWER y el patrón LIKE.
            return builder.like(
                    builder.lower(
                            builder.function("TO_CHAR", String.class, root.get(campo.toLowerCase()))
                    ),
                    "%" + valor.toLowerCase() + "%"
            );
        };
    }
}
