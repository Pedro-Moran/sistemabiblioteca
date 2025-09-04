package com.miapp.repository;

import com.miapp.model.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface NoticiaRepository extends JpaRepository<Noticia,Long> {
    List<Noticia> findByFechacreacionBetweenOrderByFechacreacionDesc(LocalDateTime start, LocalDateTime end);
}
