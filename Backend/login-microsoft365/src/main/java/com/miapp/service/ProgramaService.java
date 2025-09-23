package com.miapp.service;

import com.miapp.model.Programa;
import com.miapp.repository.EspecialidadRepository;
import com.miapp.repository.ProgramaRepository;
import com.miapp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgramaService {

    private final ProgramaRepository repository;
    private final EspecialidadRepository especialidadRepository;
    private final UsuarioRepository usuarioRepository;

    public ProgramaService(ProgramaRepository repository,
                           EspecialidadRepository especialidadRepository,
                           UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.especialidadRepository = especialidadRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Programa> listActivos() {
        return repository.findByActivoTrue();
    }

    public List<Programa> listAll() {
        return repository.findAll();
    }

    public Programa getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Programa no encontrado"));
    }

    @Transactional
    public Programa create(Programa programa) {
        programa.setIdPrograma(null);
        programa.setPrograma(normalizarCodigo(programa.getPrograma()));
        programa.setDescripcionPrograma(normalizarDescripcion(programa.getDescripcionPrograma()));
        if (programa.getActivo() == null) {
            programa.setActivo(true);
        }
        validar(programa);
        return repository.save(programa);
    }

    @Transactional
    public Programa update(Long id, Programa datos) {
        Programa programa = getById(id);
        if (datos.getPrograma() != null) {
            programa.setPrograma(normalizarCodigo(datos.getPrograma()));
        }
        if (datos.getDescripcionPrograma() != null) {
            programa.setDescripcionPrograma(normalizarDescripcion(datos.getDescripcionPrograma()));
        }
        if (datos.getActivo() != null) {
            programa.setActivo(datos.getActivo());
        }
        validar(programa);
        return repository.save(programa);
    }

    @Transactional
    public void delete(Long id) {
        Programa programa = getById(id);
        List<String> dependencias = new ArrayList<>();

        long especialidadesAsociadas = especialidadRepository.countByProgramaIdPrograma(id);
        if (especialidadesAsociadas > 0) {
            dependencias.add("especialidades (" + especialidadesAsociadas + ")");
        }

        long usuariosAsociados = usuarioRepository.countByPrograma_IdPrograma(id);
        if (usuariosAsociados > 0) {
            dependencias.add("usuarios (" + usuariosAsociados + ")");
        }

        if (!dependencias.isEmpty()) {
            throw new IllegalStateException(
                    "No se puede eliminar el programa porque existen registros relacionados en "
                            + String.join(" y ", dependencias) + ".");
        }

        repository.delete(programa);
    }

    private String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    private String normalizarDescripcion(String descripcion) {
        return descripcion == null ? null : descripcion.trim();
    }

    private void validar(Programa programa) {
        if (programa.getPrograma() == null || programa.getPrograma().isBlank()) {
            throw new IllegalArgumentException("El código del programa es obligatorio");
        }
        if (programa.getDescripcionPrograma() == null || programa.getDescripcionPrograma().isBlank()) {
            throw new IllegalArgumentException("La descripción del programa es obligatoria");
        }
    }
}