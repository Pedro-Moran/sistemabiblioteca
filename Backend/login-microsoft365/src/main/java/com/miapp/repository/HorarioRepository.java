package com.miapp.repository;

import com.miapp.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    // para filtrar si algún día lo necesitas
    List<Horario> findByFechaCreacionBetween(LocalDateTime start, LocalDateTime end);
    List<Horario> findBySedeId(Long sedeId);
}

