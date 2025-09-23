package com.miapp.repository;

import com.miapp.model.Idioma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface IdiomaRepository extends JpaRepository<Idioma, Long> { }