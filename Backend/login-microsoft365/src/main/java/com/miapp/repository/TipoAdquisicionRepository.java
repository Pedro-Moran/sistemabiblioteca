package com.miapp.repository;

import com.miapp.model.TipoAdquisicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoAdquisicionRepository extends JpaRepository<TipoAdquisicion, Long> { }
