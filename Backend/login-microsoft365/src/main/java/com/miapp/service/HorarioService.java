package com.miapp.service;

import com.miapp.model.Estado;
import com.miapp.model.Horario;
import com.miapp.model.Noticia;
import com.miapp.model.Sede;
import com.miapp.model.dto.HorarioDTO;
import com.miapp.repository.EstadoRepository;
import com.miapp.repository.HorarioRepository;
import com.miapp.repository.SedeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HorarioService {
    private final HorarioRepository repo;
    private final SedeRepository sedeRepo;
    private final EstadoRepository estadoRepo;

    public List<HorarioDTO> listar(Long sedeId) {
        List<Horario> horarios = (sedeId != null && sedeId > 0)
                ? repo.findBySedeId(sedeId)
                : repo.findAll();
        return horarios
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void guardar(HorarioDTO dto) {
        Horario h;
        if (dto.getId() == null || dto.getId() <= 0) {
            // NUEVO
            h = new Horario();
            h.setFechaCreacion(LocalDateTime.now());
            h.setUsuarioCreacion(dto.getUsuarioCreacion());
        } else {
            // ACTUALIZACIÓN
            h = repo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
            h.setFechaModificacion(LocalDateTime.now());
            h.setUsuarioModificacion(dto.getUsuarioModificacion());
        }

        // 1) Campos obligatorios que siempre actualizamos
        h.setDescripcion(dto.getDescripcion());
        h.setEstado(estadoRepo.findById(dto.getEstadoId())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado")));

        // 2) Relación sede
        if (dto.getSedeId() != null) {
            Sede sede = sedeRepo.findById(dto.getSedeId())
                    .orElseThrow(() -> new RuntimeException("Sede no encontrada"));
            h.setSede(sede);
        }

        repo.save(h);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    public void cambiarEstado(Long id, Long nuevoEstado, String usuarioModifica) {
        Horario h = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        System.out.println("ver estado: "+ nuevoEstado);
        Estado e = estadoRepo.findById(nuevoEstado)
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));
        h.setEstado(e);
        h.setUsuarioModificacion(usuarioModifica);
        h.setFechaModificacion(LocalDateTime.now());
        repo.save(h);
    }

    private HorarioDTO toDto(Horario h) {
        return HorarioDTO.fromEntity(h);
    }
}

