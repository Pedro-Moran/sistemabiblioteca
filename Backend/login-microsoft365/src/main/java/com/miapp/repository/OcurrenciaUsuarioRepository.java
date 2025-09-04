package com.miapp.repository;

import com.miapp.model.OcurrenciaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OcurrenciaUsuarioRepository extends JpaRepository<OcurrenciaUsuario, Long> {
    List<OcurrenciaUsuario> findByIdocurrencia(Long idocurrencia);
}