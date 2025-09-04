package com.miapp.service;

import com.miapp.model.Noticia;
import com.miapp.model.Estado;
import com.miapp.model.dto.NoticiaDTO;

import com.miapp.repository.EstadoRepository;
import com.miapp.repository.NoticiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class NoticiaService {
    private final NoticiaRepository repo;
    private final EstadoRepository estadoRepo;

    public List<NoticiaDTO> listarPorFecha(LocalDateTime start, LocalDateTime end) {
        return repo.findByFechacreacionBetweenOrderByFechacreacionDesc(start, end).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void guardar(NoticiaDTO dto, MultipartFile imagenFile) {
        // 1) Obtengo o creo la entidad según venga el id
        Noticia n;
        LocalDateTime ahora = LocalDateTime.now();
        if (dto.getIdnoticia() == null || dto.getIdnoticia() <= 0) {
            // Alta
            n = new Noticia();
            n.setUsuariocreacion(dto.getUsuariocreacion());
        } else {
            // Si viene id, intento recuperarla; si no existe, también la trato como nueva
            n = repo.findById(dto.getIdnoticia()).orElse(new Noticia());
            n.setUsuariomodificacion(dto.getUsuariomodificacion());
            n.setFechamodificacion(ahora);
        }

        // 2) Campos comunes
        n.setTitular(dto.getTitular());
        n.setSubtitulo(dto.getSubtitulo());
        n.setAutor(dto.getAutor());
        n.setDescripcion(dto.getDescripcion());
        if (imagenFile != null && !imagenFile.isEmpty()) {
            try {
                String b64 = Base64.getEncoder().encodeToString(imagenFile.getBytes());
                n.setImagen("data:" + imagenFile.getContentType() + ";base64," + b64);
            } catch (Exception ex) {
                throw new RuntimeException("Error leyendo imagen", ex);
            }
        }
        n.setEnlace(dto.getEnlace());
        Estado e = estadoRepo.findById(dto.getEstadoId())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));
        n.setEstado(e);

        // 3) Fecha de creación
        LocalDateTime fecha = dto.getFechacreacion() != null ? dto.getFechacreacion() : ahora;
        n.setFechacreacion(fecha);

        // 4) Guardo (insertará nuevo o actualizará existente)
        repo.save(n);
    }


    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    public void cambiarEstado(Long noticiaId, Long nuevoEstadoId, String idUsuario) {
        Noticia n = repo.findById(noticiaId)
                .orElseThrow(() -> new RuntimeException("Noticia no encontrada"));
        Estado e = estadoRepo.findById(nuevoEstadoId)
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));
        n.setEstado(e);
        n.setUsuariomodificacion(idUsuario);
        n.setFechamodificacion(LocalDateTime.now());
        repo.save(n);
    }

    private NoticiaDTO toDto(Noticia n) {
        NoticiaDTO dto = new NoticiaDTO();
        dto.setIdnoticia(n.getIdnoticia());
        dto.setTitular(n.getTitular());
        dto.setSubtitulo(n.getSubtitulo());
        dto.setAutor(n.getAutor());
        dto.setDescripcion(n.getDescripcion());
        dto.setImagenUrl(n.getImagen());
        dto.setEnlace(n.getEnlace());
        dto.setEstadoId(n.getEstado().getIdEstado());
        dto.setEstadoDescripcion(n.getEstado().getDescripcion());
        dto.setUsuariocreacion(n.getUsuariocreacion());
        dto.setUsuariomodificacion(n.getUsuariomodificacion());
        dto.setFechacreacion(n.getFechacreacion());
        dto.setFechamodificacion(n.getFechamodificacion());
        return dto;
    }
}
