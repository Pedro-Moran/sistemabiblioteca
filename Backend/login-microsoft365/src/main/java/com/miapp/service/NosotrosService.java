package com.miapp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miapp.model.dto.NosotrosDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.core.io.Resource;

@Service
public class NosotrosService {
    private final Path file;
    private final ObjectMapper mapper = new ObjectMapper();

    public NosotrosService(
            @Value("${app.nosotros-file:config/nosotros.json}") String ruta
    ) {
        this.file = Path.of(ruta);
        try {
            // Asegurarnos de que la carpeta existe
            Files.createDirectories(this.file.getParent());
            // Si no existía el fichero, lo inicializamos vacío o con un default
            if (Files.notExists(this.file)) {
                mapper
                        .writerWithDefaultPrettyPrinter()
                        .writeValue(this.file.toFile(),
                                new NosotrosDTO(/* valores por defecto */));
            }
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar nosotros.json", e);
        }
    }

    public NosotrosDTO load() {
        try {
            return mapper.readValue(file.toFile(), NosotrosDTO.class);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer nosotros.json", e);
        }
    }

    public void save(NosotrosDTO dto) {
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(file.toFile(), dto);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo escribir nosotros.json", e);
        }
    }
}