package com.miapp.model.dto;

import java.math.BigDecimal;

public record OcurrenciaMaterialDTO(
        Long        idMaterial,
        String      codigoEquipo,
        String      nombreEquipo,
        Integer     cantidad,
        BigDecimal  costo,
        Boolean     esBiblioteca
) {}