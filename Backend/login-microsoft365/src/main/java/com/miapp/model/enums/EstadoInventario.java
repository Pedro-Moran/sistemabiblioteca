package com.miapp.model.enums;

import java.util.Locale;
import java.util.Optional;

public enum EstadoInventario {
    ENCONTRADO,
    NO_ENCONTRADO,
    PENDIENTE;

    public static Optional<EstadoInventario> from(String value) {
        if (value == null) {
            return Optional.empty();
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        if (normalized.isEmpty()) {
            return Optional.empty();
        }
        try {
            return Optional.of(EstadoInventario.valueOf(normalized));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}