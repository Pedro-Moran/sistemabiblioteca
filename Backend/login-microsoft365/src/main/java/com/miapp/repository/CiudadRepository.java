package com.miapp.repository;

import com.miapp.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CiudadRepository extends JpaRepository<Ciudad, String> {
    List<Ciudad> findByPaisPaisId(String paisId);
}