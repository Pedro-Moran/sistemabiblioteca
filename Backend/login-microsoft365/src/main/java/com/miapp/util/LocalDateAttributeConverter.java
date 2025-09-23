package com.miapp.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.sql.Timestamp;
import java.time.LocalDate;

/**
 * Convierte LocalDate a Timestamp para compatibilidad con columnas TIMESTAMP
 * preservando solo la fecha (hora 00:00:00).
 */
@Converter(autoApply = false)
public class LocalDateAttributeConverter implements AttributeConverter<LocalDate, Timestamp> {

    @Override
    public Timestamp convertToDatabaseColumn(LocalDate attribute) {
        return attribute == null ? null : Timestamp.valueOf(attribute.atStartOfDay());
    }

    @Override
    public LocalDate convertToEntityAttribute(Timestamp dbData) {
        return dbData == null ? null : dbData.toLocalDateTime().toLocalDate();
    }
}