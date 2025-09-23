package com.miapp.service;

import com.miapp.model.Especialidad;
import com.miapp.model.Programa;
import com.miapp.repository.BibliotecaRepository;
import com.miapp.repository.EspecialidadRepository;
import com.miapp.repository.MaterialBibliograficoRepository;
import com.miapp.repository.ProgramaRepository;
import com.miapp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;
    private final ProgramaRepository programaRepository;
    private final UsuarioRepository usuarioRepository;
    private final BibliotecaRepository bibliotecaRepository;
    private final MaterialBibliograficoRepository materialBibliograficoRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository,
                               ProgramaRepository programaRepository,
                               UsuarioRepository usuarioRepository,
                               BibliotecaRepository bibliotecaRepository,
                               MaterialBibliograficoRepository materialBibliograficoRepository) {
        this.especialidadRepository = especialidadRepository;
        this.programaRepository = programaRepository;
        this.usuarioRepository = usuarioRepository;
        this.bibliotecaRepository = bibliotecaRepository;
        this.materialBibliograficoRepository = materialBibliograficoRepository;
    }

    @Transactional
    public Especialidad create(Especialidad especialidad) {
        Programa programa = obtenerPrograma(especialidad.getPrograma());
        String codigo = normalizarCodigo(especialidad.getCodigoEspecialidad());
        String descripcion = normalizarDescripcion(especialidad.getDescripcion());

        validarCodigoDuplicado(codigo, null);
        validarDescripcionDuplicada(programa.getIdPrograma(), descripcion, null);

        especialidad.setPrograma(programa);
        especialidad.setCodigoEspecialidad(codigo);
        especialidad.setDescripcion(descripcion);
        if (especialidad.getActivo() == null) {
            especialidad.setActivo(true);
        }
        return especialidadRepository.save(especialidad);
    }

    /**
     * Alias de {@link #create(Especialidad)} para mantener compatibilidad con
     * controladores existentes que invocan a {@code save} al registrar nuevas
     * especialidades.
     */
    @Transactional
    public Especialidad save(Especialidad especialidad) {
        return create(especialidad);
    }

    public List<Especialidad> listActivas() {
        return especialidadRepository.findByActivoTrue();
    }

    public List<Especialidad> getActivos() {
        return listActivas();
    }

    public List<Especialidad> listAll() {
        return especialidadRepository.findAll();
    }

    public Especialidad getById(Long id) {
        return especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
    }

    @Transactional
    public Especialidad update(Long id, Especialidad datos) {
        Especialidad especialidad = getById(id);

        if (datos.getPrograma() != null && datos.getPrograma().getIdPrograma() != null
                && !datos.getPrograma().getIdPrograma().equals(especialidad.getPrograma().getIdPrograma())) {
            Programa nuevoPrograma = obtenerPrograma(datos.getPrograma());
            especialidad.setPrograma(nuevoPrograma);
        }

        if (datos.getCodigoEspecialidad() != null) {
            String codigo = normalizarCodigo(datos.getCodigoEspecialidad());
            if (!codigo.equalsIgnoreCase(especialidad.getCodigoEspecialidad())) {
                validarCodigoDuplicado(codigo, especialidad.getIdEspecialidad());
                especialidad.setCodigoEspecialidad(codigo);
            }
        }

        if (datos.getDescripcion() != null) {
            String descripcion = normalizarDescripcion(datos.getDescripcion());
            if (!descripcion.equalsIgnoreCase(especialidad.getDescripcion())) {
                validarDescripcionDuplicada(especialidad.getPrograma().getIdPrograma(), descripcion,
                        especialidad.getIdEspecialidad());
                especialidad.setDescripcion(descripcion);
            }
        }

        if (datos.getActivo() != null) {
            especialidad.setActivo(datos.getActivo());
        }

        return especialidadRepository.save(especialidad);
    }

    @Transactional
    public void delete(Long id) {
        Especialidad especialidad = getById(id);
        List<String> dependencias = new ArrayList<>();

        long usuariosAsociados = usuarioRepository.countByEspecialidad_IdEspecialidad(id);
        if (usuariosAsociados > 0) {
            dependencias.add("usuarios (" + usuariosAsociados + ")");
        }

        long bibliotecasAsociadas = bibliotecaRepository.countByEspecialidadIdEspecialidad(id);
        if (bibliotecasAsociadas > 0) {
            dependencias.add("bibliotecas (" + bibliotecasAsociadas + ")");
        }

        long materialesAsociados = materialBibliograficoRepository.countByEspecialidad_IdEspecialidad(id);
        if (materialesAsociados > 0) {
            dependencias.add("materiales bibliográficos (" + materialesAsociados + ")");
        }

        if (!dependencias.isEmpty()) {
            throw new IllegalStateException(
                    "No se puede eliminar la especialidad porque existen registros relacionados en "
                            + String.join(" y ", dependencias) + ".");
        }

        especialidadRepository.delete(especialidad);
    }

    private Programa obtenerPrograma(Programa programa) {
        if (programa == null || programa.getIdPrograma() == null) {
            throw new IllegalArgumentException("El programa asociado es obligatorio");
        }
        Long idPrograma = programa.getIdPrograma();
        return programaRepository.findById(idPrograma)
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado: " + idPrograma));
    }

    private String normalizarCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código de la especialidad es obligatorio");
        }
        return codigo.trim().toUpperCase();
    }

    private String normalizarDescripcion(String descripcion) {
        if (descripcion == null || descripcion.isBlank()) {
            throw new IllegalArgumentException("La descripción de la especialidad es obligatoria");
        }
        return descripcion.trim();
    }

    private void validarCodigoDuplicado(String codigo, Long idExcluir) {
        boolean existe = idExcluir == null
                ? especialidadRepository.findByCodigoEspecialidadIgnoreCase(codigo).isPresent()
                : especialidadRepository
                .findByCodigoEspecialidadIgnoreCaseAndIdEspecialidadNot(codigo, idExcluir)
                .isPresent();
        if (existe) {
            throw new IllegalArgumentException("El código de la especialidad ya se encuentra registrado");
        }
    }

    private void validarDescripcionDuplicada(Long idPrograma, String descripcion, Long idExcluir) {
        boolean existe = idExcluir == null
                ? especialidadRepository
                .findByProgramaIdProgramaAndDescripcionIgnoreCase(idPrograma, descripcion)
                .isPresent()
                : especialidadRepository
                .findByProgramaIdProgramaAndDescripcionIgnoreCaseAndIdEspecialidadNot(idPrograma, descripcion,
                        idExcluir)
                .isPresent();
        if (existe) {
            throw new IllegalArgumentException(
                    "La descripción de la especialidad ya se encuentra registrada para el programa seleccionado");
        }
    }
}