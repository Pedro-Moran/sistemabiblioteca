package com.miapp.service;

import com.miapp.model.MaterialBibliografico;
import org.springframework.data.jpa.domain.Specification;

public class MaterialBibliograficoSpecification {

    public static Specification<MaterialBibliografico> filtro(String campo, String valor) {
        return (root, query, builder) -> {
            if (campo == null || valor == null || valor.isEmpty()) {
                return builder.conjunction(); // No aplica filtro
            }
            return builder.like(builder.lower(root.get(campo.toLowerCase())), "%" + valor.toLowerCase() + "%");
        };
    }
}
