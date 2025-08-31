package com.miapp.repository;

import com.miapp.model.TipoBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoBibliotecaRepository extends JpaRepository<TipoBiblioteca, Long> { }