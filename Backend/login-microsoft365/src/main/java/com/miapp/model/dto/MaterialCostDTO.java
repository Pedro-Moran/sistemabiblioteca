package com.miapp.model.dto;

import java.math.BigDecimal;

public record MaterialCostDTO(
        Long       idMaterial,
        BigDecimal costoUnitario
) {}