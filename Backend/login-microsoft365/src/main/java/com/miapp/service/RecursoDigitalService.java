package com.miapp.service;

import com.miapp.model.RecursoDigital;
import com.miapp.model.TipoRecursoDigital;
import com.miapp.model.dto.RecursoDigitalDTO;
import com.miapp.repository.RecursoDigitalRepository;
import com.miapp.repository.TipoRecursoDigitalRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecursoDigitalService {
    private final RecursoDigitalRepository repo;
    private final TipoRecursoDigitalRepository tipoRepo;

    public List<RecursoDigitalDTO> listar() {
        return repo.findByEstado(1).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<RecursoDigitalDTO> listarPorTipo(Long tipoId) {
        return repo.findByTipoIdAndEstado(tipoId, 1).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void guardar(RecursoDigitalDTO dto, MultipartFile imagenFile) {
        RecursoDigital e = dto.getId() != null
                ? repo.findById(dto.getId()).orElse(new RecursoDigital())
                : new RecursoDigital();

        if (e.getClicks() == null) {
            e.setClicks(0L);
        }

        e.setAutor(dto.getAutor());
        if (dto.getTipoId() != null) {
            TipoRecursoDigital t = tipoRepo.findById(dto.getTipoId())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado: " + dto.getTipoId()));
            e.setTipo(t);
        } else {
            e.setTipo(null);
        }
        e.setTitulo(dto.getTitulo());
        e.setDescripcion(dto.getDescripcion());
        e.setEnlace(dto.getEnlace());
        e.setEstado(dto.getEstado());
        if (imagenFile != null && !imagenFile.isEmpty()) {
            try {
                String b64 = Base64.getEncoder().encodeToString(imagenFile.getBytes());
                e.setImagen("data:" + imagenFile.getContentType() + ";base64," + b64);
            } catch (Exception ex) {
                throw new RuntimeException("Error leyendo imagen", ex);
            }
        }
        // auditoría
        if (e.getFechaCreacion() == null) {
            e.setFechaCreacion(LocalDateTime.now());
            e.setUsuarioCreacion(dto.getUsuarioCreacion());
        } else {
            e.setFechaModificacion(LocalDateTime.now());
            e.setUsuarioModificacion(dto.getUsuarioModificacion());
        }
        repo.save(e);
    }

    public String obtenerEnlace(Long id) {
        RecursoDigital e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No encontrado"));
        if (e.getClicks() == null) {
            e.setClicks(1L);
        } else {
            e.setClicks(e.getClicks() + 1);
        }
        repo.save(e);
        return e.getEnlace();
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    @Transactional
    public void deleteAll(List<Long> ids) {
        List<RecursoDigital> registros = repo.findAllById(ids);
        repo.deleteAllInBatch(registros);
        repo.flush();
    }

    public void cambiarEstado(Long id, Integer nuevoEstado, String usuario) {
        RecursoDigital e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No encontrado"));
        e.setEstado(nuevoEstado);
        e.setUsuarioModificacion(usuario);
        e.setFechaModificacion(LocalDateTime.now());
        repo.save(e);
    }

    private RecursoDigitalDTO toDto(RecursoDigital e) {
        RecursoDigitalDTO d = new RecursoDigitalDTO();
        d.setId(e.getId());
        d.setAutor(e.getAutor());
        d.setTitulo(e.getTitulo());
        d.setDescripcion(e.getDescripcion());
        d.setEnlace(e.getEnlace());
        d.setEstado(e.getEstado());
        d.setUsuarioCreacion(e.getUsuarioCreacion());
        d.setUsuarioModificacion(e.getUsuarioModificacion());
        d.setFechaCreacion(e.getFechaCreacion());
        d.setFechaModificacion(e.getFechaModificacion());
        d.setImagenUrl(e.getImagen());
        d.setClicks(e.getClicks());
        if (e.getTipo() != null) {
            d.setTipoId(e.getTipo().getId());
            d.setTipoDescripcion(e.getTipo().getDescripcion());
        }
        return d;
    }
}
