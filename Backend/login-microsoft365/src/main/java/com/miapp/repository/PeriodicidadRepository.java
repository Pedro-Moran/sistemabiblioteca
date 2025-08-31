package com.miapp.repository;

import com.miapp.model.Periodicidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeriodicidadRepository extends JpaRepository<Periodicidad, Long> { }